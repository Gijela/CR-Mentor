// 上传文件
export const uploadFile = async (e: any, userId: string) => {
  try {
    const file = e.file.originFileObj;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderName', userId);

    const response = await fetch('/api/supabase/uploadFile', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error("上传文件时出错:", response.statusText);
      return { success: false, message: response.statusText, data: {} }
    }

    const { data } = await response.json();
    return { success: true, message: '上传成功', data }
  } catch (error) {
    console.error("上传文件时出错:", error);
    return { success: false, message: error, data: {} }
  }
}

// 获取文件列表
export const getFileList = async (userId: string) => {
  try {
    const response = await fetch("/api/supabase/getFileList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        folderName: userId
      })
    });

    if (!response.ok) {
      console.error("获取文件列表时出错:", response.statusText);
      return { success: false, message: response.statusText, data: {} }
    }

    const { data } = await response.json();
    return { success: true, message: '获取文件列表成功', data }
  } catch (error) {
    console.error("获取文件列表时出错:", error);
    return { success: false, message: error, data: {} }
  }
};

// 下载文件
export const downloadFile = async (folderName: string, fileName: string) => {
  try {
    const response = await fetch("/api/supabase/downloadFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        folderName,
        fileName
      })
    });

    if (!response.ok) {
      console.error("下载文件时出错:", response.statusText);
      return { success: false, message: response.statusText, data: {} }
    }

    const { data } = await response.json();
    return { success: true, message: '下载文件成功', data }
  } catch (error) {
    console.error("下载文件时出错:", error);
    return { success: false, message: error, data: {} }
  }
}

// 获取仓库对应的代码规范文件
export const getRepoFile = async (repo_fullName: string) => {
  try {
    const response = await fetch("/api/supabase/getRepoFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo_fullName
      })
    });
    const data = await response.json();
    return data
  } catch (error) {
    console.error("获取仓库对应的文件时出错:", error);
    return { success: false, message: error }
  }
}

// 保存仓库对应的代码规范文件
export const postRepoFile = async (repo_fullName: string, userId: string, file_name: string) => {
  try {
    const response = await fetch("/api/supabase/setRepoFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo_fullName,
        folder_name: userId,
        file_name
      })
    });
    const data = await response.json();
    return data
  } catch (error) {
    console.error("保存仓库对应的文件时出错:", error);
    return { success: false, message: error }
  }
}