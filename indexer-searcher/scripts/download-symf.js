const fs = require("fs");
const path = require("path");
const os = require("os");
const https = require("https");
const { execSync } = require("child_process");
const { promisify } = require("util");

const SYMF_VERSION = "v0.0.16";
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2秒

function getPlatformInfo() {
    const platform = os.platform();
    const arch = os.machine();

    // 将 arm64 映射到 aarch64
    const normalizedArch = arch === 'arm64' ? 'aarch64' : arch;

    let zigPlatform;
    switch (platform) {
        case "linux":
            zigPlatform = "linux-musl";
            break;
        case "win32":
            zigPlatform = "windows-gnu";
            break;
        case "darwin":
            zigPlatform = "macos";
            break;
        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }

    const symfFilename = `symf-${SYMF_VERSION}-${normalizedArch}-${platform}`;
    const symfUnzippedFilename = `symf-${normalizedArch}-${zigPlatform}`;

    return {
        platform,
        arch: normalizedArch,
        zigPlatform,
        symfFilename,
        symfUnzippedFilename,
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadFile(url, dest, signal) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        let retryCount = 0;

        const download = () => {
            const request = https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
                    return;
                }

                const total = parseInt(response.headers['content-length'], 10);
                let current = 0;

                response.on('data', (chunk) => {
                    current += chunk.length;
                    const progress = Math.round((current / total) * 100);
                    process.stdout.write(`\rDownloading: ${progress}%`);
                });

                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    process.stdout.write('\n');
                    resolve();
                });
            });

            request.on("error", async (err) => {
                file.close();
                fs.unlink(dest, () => {});

                if (retryCount < MAX_RETRIES) {
                    console.log(`\nDownload failed, retrying in ${RETRY_DELAY/1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
                    retryCount++;
                    await sleep(RETRY_DELAY);
                    download();
                } else {
                    reject(new Error(`Failed to download after ${MAX_RETRIES} attempts: ${err.message}`));
                }
            });

            if (signal) {
                signal.addEventListener('abort', () => {
                    request.abort();
                    file.close();
                    fs.unlink(dest, () => {});
                    reject(new Error('Download aborted'));
                });
            }
        };

        download();
    });
}

async function unzip(zipPath, destDir) {
    const platform = os.platform();
    if (platform === "win32") {
        execSync(
            `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force"`,
        );
    } else {
        execSync(`unzip -o '${zipPath}' -d '${destDir}'`);
    }
}

async function main() {
    try {
        const { platform, arch, zigPlatform, symfFilename, symfUnzippedFilename } = getPlatformInfo();
        const binDir = path.join(__dirname, "..", "node_modules", ".bin");

        // 确保 .bin 目录存在
        if (!fs.existsSync(binDir)) {
            fs.mkdirSync(binDir, { recursive: true });
        }

        const symfPath = path.join(binDir, platform === "win32" ? "symf.exe" : "symf");

        // 如果 symf 已经存在，跳过下载
        if (fs.existsSync(symfPath)) {
            console.log("symf already exists, skipping download");
            return;
        }

        // 下载 symf
        const url = `https://github.com/sourcegraph/symf/releases/download/${SYMF_VERSION}/symf-${arch}-${zigPlatform}.zip`;
        const symfTmpDir = `${symfPath}.tmp`;
        const symfZipFile = path.join(symfTmpDir, `${symfFilename}.zip`);

        // 创建临时目录
        if (!fs.existsSync(symfTmpDir)) {
            fs.mkdirSync(symfTmpDir, { recursive: true });
        }

        console.log(`Downloading symf from ${url}`);
        await downloadFile(url, symfZipFile);

        // 解压文件
        console.log("Extracting symf...");
        await unzip(symfZipFile, symfTmpDir);

        // 移动文件到最终位置
        const tmpFile = path.join(symfTmpDir, symfUnzippedFilename);
        fs.chmodSync(tmpFile, "755");
        fs.renameSync(tmpFile, symfPath);

        // 清理临时文件
        fs.rmSync(symfTmpDir, { recursive: true, force: true });

        console.log("symf installed successfully");
    } catch (error) {
        console.error("Error installing symf:", error.message);
        process.exit(1);
    }
}

main().catch(error => {
    console.error("Fatal error:", error.message);
    process.exit(1);
});
