import { EDIT_TYPE } from "@/lib/groupDiff/types";

export interface FileObject {
  /** 文件名 */
  filename: string;
  /** Patch 内容，对于没有具体 Patch 信息的删除文件，此值为 null */
  patch: string | null;
  /** 编辑类型 */
  status: EDIT_TYPE;
  /** 变更行数 */
  changes: number;
  /** 其他相关字段 */
  [key: string]: any;
}
