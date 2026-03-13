import { Task } from "../../dist/types/public-types";

// Mock数据接口定义
interface MockTask {
  id: number;
  parentId: number;
  taskNo: number;
  title: string;
  project: string[];
  statusInfoVo: {
    code: number;
    description: string;
    color: string;
  };
  levelInfo: {
    code: number;
    description: string;
    color: string;
  };
  createDate: string;
  deadLine: string;
  finishDate: string;
  delayDays: number;
  proposer: {
    employeeNo: string;
    name: string;
    leaveStatus: number;
  };
  supervisor: Array<{
    type: string;
    name: string;
    identity: string;
    leaveStatus: number;
  }>;
  progressPercent: number;
  children: MockTask[] | null;
  number: number;
  [key: string]: any;
}

// Mock数据
const mockData: MockTask[] = [
  {
    "id": 6794,
    "parentId": 0,
    "taskNo": 202507110034,
    "title": "哈哈哈",
    "project": [
      "Others"
    ],
    "statusInfoVo": {
      "code": 1,
      "description": "待確認",
      "color": "rgb(255,192,0)"
    },
    "levelInfo": {
      "code": 2,
      "description": "中",
      "color": "#3cb371"
    },
    "createDate": "2025-07-11",
    "deadLine": "2025-07-21",
    "finishDate": "",
    "delayDays": 193,
    "proposer": {
      "employeeNo": "F1669075",
      "name": "何聪",
      "leaveStatus": 0
    },
    "supervisor": [
      {
        "type": "EMPLOYEE",
        "name": "何聪",
        "identity": "F1669075",
        "leaveStatus": 0
      },
      {
        "type": "EMPLOYEE",
        "name": "凌峰",
        "identity": "G1659743",
        "leaveStatus": 0
      },
      {
        "type": "EMPLOYEE",
        "name": "林俊翰",
        "identity": "G1659987",
        "leaveStatus": 0
      },
      {
        "type": "EMPLOYEE",
        "name": "AvelinoBuenafeIII",
        "identity": "FSHK277",
        "leaveStatus": 0
      }
    ],
    "progressPercent": 0,
    "children": [
      {
        "id": 8762,
        "parentId": 6794,
        "taskNo": 202512120002,
        "title": "哈哈哈",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-12-12",
        "deadLine": "2025-07-12",
        "finishDate": "",
        "delayDays": 202,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "凌峰",
            "identity": "G1659743",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 1
      },
      {
        "id": 8763,
        "parentId": 6794,
        "taskNo": 202512120004,
        "title": "哈哈哈",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-12-12",
        "deadLine": "2025-07-12",
        "finishDate": "",
        "delayDays": 202,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "吳凌紅",
            "identity": "G1658684",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 2
      },
      {
        "id": 8764,
        "parentId": 6794,
        "taskNo": 202512120006,
        "title": "哈哈哈",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-12-12",
        "deadLine": "2025-07-12",
        "finishDate": "",
        "delayDays": 202,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "張占騰",
            "identity": "G1658973",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 3
      },
      {
        "id": 8765,
        "parentId": 6794,
        "taskNo": 202512120008,
        "title": "哈哈哈",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-12-12",
        "deadLine": "2025-07-12",
        "finishDate": "",
        "delayDays": 202,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "林俊翰",
            "identity": "G1659987",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 4
      },
      {
        "id": 9286,
        "parentId": 6794,
        "taskNo": 202601190002,
        "title": "大大",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2026-01-19",
        "deadLine": "2026-01-20",
        "finishDate": "",
        "delayDays": 10,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "何聪",
            "identity": "F1669075",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 5
      }
    ],
    "number": 0
  },
  {
    "id": 8745,
    "parentId": 0,
    "taskNo": 202512100010,
    "title": "不想吃宣传部",
    "project": [
      "MW-W (MW25)"
    ],
    "statusInfoVo": {
      "code": 1,
      "description": "待確認",
      "color": "rgb(255,192,0)"
    },
    "levelInfo": {
      "code": 2,
      "description": "中",
      "color": "#3cb371"
    },
    "createDate": "2025-12-10",
    "deadLine": "2025-12-23",
    "finishDate": "",
    "delayDays": 38,
    "proposer": {
      "employeeNo": "F1669075",
      "name": "何聪",
      "leaveStatus": 0
    },
    "supervisor": [
      {
        "type": "EMPLOYEE",
        "name": "何聪",
        "identity": "F1669075",
        "leaveStatus": 0
      }
    ],
    "progressPercent": 0,
    "children": [
      {
        "id": 9285,
        "parentId": 8745,
        "taskNo": 202601170002,
        "title": "yr",
        "project": [
          "MW-W (MW25)"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2026-01-17",
        "deadLine": "2026-01-18",
        "finishDate": "",
        "delayDays": 12,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "Anthonne Rey Araojo Castillo",
            "identity": "FSHK280",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 1
      }
    ],
    "number": 0
  },
  {
    "id": 9287,
    "parentId": 0,
    "taskNo": 202601190004,
    "title": "test",
    "project": [
      "系統開發"
    ],
    "statusInfoVo": {
      "code": 1,
      "description": "待確認",
      "color": "rgb(255,192,0)"
    },
    "levelInfo": {
      "code": 2,
      "description": "中",
      "color": "#3cb371"
    },
    "createDate": "2026-01-19",
    "deadLine": "2026-01-24",
    "finishDate": "",
    "delayDays": 6,
    "proposer": {
      "employeeNo": "F1669075",
      "name": "何聪",
      "leaveStatus": 0
    },
    "supervisor": [
      {
        "type": "employee",
        "name": "何聪",
        "identity": "F1669075",
        "leaveStatus": 0
      }
    ],
    "progressPercent": 0,
    "children": [
      {
        "id": 9288,
        "parentId": 9287,
        "taskNo": 202601190006,
        "title": "1",
        "project": [
          "系統開發"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2026-01-19",
        "deadLine": "2026-01-20",
        "finishDate": "",
        "delayDays": 10,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 0,
        "children": null,
        "number": 1
      },
      {
        "id": 9289,
        "parentId": 9287,
        "taskNo": 202601190008,
        "title": "2",
        "project": [
          "系統開發"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2026-01-19",
        "deadLine": "2026-01-20",
        "finishDate": "",
        "delayDays": 10,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 0,
        "children": null,
        "number": 2
      },
      {
        "id": 9298,
        "parentId": 9287,
        "taskNo": 202601220010,
        "title": "而5re吧",
        "project": [
          "系統開發"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2026-01-22",
        "deadLine": "2026-01-23",
        "finishDate": "",
        "delayDays": 7,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "Angelique Cahanding Nadora",
            "identity": "FSHK374",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 3
      },
      {
        "id": 9299,
        "parentId": 9287,
        "taskNo": 202601220012,
        "title": "个",
        "project": [
          "系統開發"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2026-01-22",
        "deadLine": "2026-01-23",
        "finishDate": "",
        "delayDays": 7,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "Angelique Cahanding Nadora",
            "identity": "FSHK374",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 4
      },
      {
        "id": 9300,
        "parentId": 9287,
        "taskNo": 202601220014,
        "title": "个",
        "project": [
          "系統開發"
        ],
        "statusInfoVo": {
          "code": 1,
          "description": "待確認",
          "color": "rgb(255,192,0)"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2026-01-22",
        "deadLine": "2026-01-23",
        "finishDate": "",
        "delayDays": 7,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "Angelique Cahanding Nadora",
            "identity": "FSHK374",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 5
      }
    ],
    "number": 0
  },
  {
    "id": 9281,
    "parentId": 0,
    "taskNo": 202601160002,
    "title": "test",
    "project": [
      "系統開發"
    ],
    "statusInfoVo": {
      "code": 1,
      "description": "待確認",
      "color": "rgb(255,192,0)"
    },
    "levelInfo": {
      "code": 2,
      "description": "中",
      "color": "#3cb371"
    },
    "createDate": "2026-01-16",
    "deadLine": "2026-01-17",
    "finishDate": "",
    "delayDays": 13,
    "proposer": {
      "employeeNo": "F1669075",
      "name": "何聪",
      "leaveStatus": 0
    },
    "supervisor": [
      {
        "type": "employee",
        "name": "何聪",
        "identity": "F1669075",
        "leaveStatus": 0
      }
    ],
    "progressPercent": 0,
    "children": [
      {
        "id": 9282,
        "parentId": 9281,
        "taskNo": 202601160004,
        "title": "1",
        "project": [
          "系統開發"
        ],
        "statusInfoVo": {
          "code": 4,
          "description": "已完成",
          "color": "#008000"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2026-01-16",
        "deadLine": "2026-01-17",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 0,
        "children": null,
        "number": 1
      },
      {
        "id": 9283,
        "parentId": 9281,
        "taskNo": 202601160006,
        "title": "2",
        "project": [
          "系統開發"
        ],
        "statusInfoVo": {
          "code": 4,
          "description": "已完成",
          "color": "#008000"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2026-01-16",
        "deadLine": "2026-01-17",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 0,
        "children": null,
        "number": 2
      },
      {
        "id": 9284,
        "parentId": 9281,
        "taskNo": 202601160008,
        "title": "3",
        "project": [
          "系統開發"
        ],
        "statusInfoVo": {
          "code": 4,
          "description": "已完成",
          "color": "#008000"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2026-01-16",
        "deadLine": "2026-01-17",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "Anthonne Rey Araojo Castillo",
            "identity": "FSHK280",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 3
      }
    ],
    "number": 0
  },
  {
    "id": 8798,
    "parentId": 0,
    "taskNo": 202512240004,
    "title": "重新測試駁回",
    "project": [
      "系統開發",
      "MIL",
      "RFQ",
      "Others"
    ],
    "statusInfoVo": {
      "code": 3,
      "description": "待驗收",
      "color": "#98FB98"
    },
    "levelInfo": {
      "code": 2,
      "description": "中",
      "color": "#3cb371"
    },
    "createDate": "2025-12-24",
    "deadLine": "2025-12-25",
    "finishDate": "2026-01-12 08:09:14",
    "delayDays": 0,
    "proposer": {
      "employeeNo": "F1669075",
      "name": "何聪",
      "leaveStatus": 0
    },
    "supervisor": [
      {
        "type": "employee",
        "name": "何聪",
        "identity": "F1669075",
        "leaveStatus": 0
      }
    ],
    "progressPercent": 100,
    "children": null,
    "number": 0
  },
  {
    "id": 8797,
    "parentId": 0,
    "taskNo": 202512240002,
    "title": "测驳回字段",
    "project": [
      "系統開發",
      "MIL",
      "RFQ",
      "Others"
    ],
    "statusInfoVo": {
      "code": 2,
      "description": "處理中",
      "color": "blue"
    },
    "levelInfo": {
      "code": 3,
      "description": "高",
      "color": "#ff6a6a"
    },
    "createDate": "2025-12-24",
    "deadLine": "2025-12-25",
    "finishDate": "2025-12-24 14:18:22",
    "delayDays": 36,
    "proposer": {
      "employeeNo": "F1669075",
      "name": "何聪",
      "leaveStatus": 0
    },
    "supervisor": [
      {
        "type": "employee",
        "name": "何聪",
        "identity": "F1669075",
        "leaveStatus": 0
      }
    ],
    "progressPercent": 35,
    "children": null,
    "number": 0
  },
  {
    "id": 6812,
    "parentId": 0,
    "taskNo": 202507140004,
    "title": "哈哈哈",
    "project": [
      "Others"
    ],
    "statusInfoVo": {
      "code": 5,
      "description": "掛起中",
      "color": "gray"
    },
    "levelInfo": {
      "code": 2,
      "description": "中",
      "color": "#3cb371"
    },
    "createDate": "2025-07-14",
    "deadLine": "2025-07-24",
    "finishDate": "",
    "delayDays": 0,
    "proposer": {
      "employeeNo": "F1669075",
      "name": "何聪",
      "leaveStatus": 0
    },
    "supervisor": [
      {
        "type": "EMPLOYEE",
        "name": "何聪",
        "identity": "F1669075",
        "leaveStatus": 0
      },
      {
        "type": "EMPLOYEE",
        "name": "凌峰",
        "identity": "G1659743",
        "leaveStatus": 0
      }
    ],
    "progressPercent": 20,
    "children": [
      {
        "id": 7328,
        "parentId": 6812,
        "taskNo": 202507160484,
        "title": "1",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 5,
          "description": "掛起中",
          "color": "gray"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-07-16",
        "deadLine": "2025-07-16",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "Alvin Patarata Aguyapa",
            "identity": "HZP00217",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 1
      },
      {
        "id": 7766,
        "parentId": 6812,
        "taskNo": 202511250005,
        "title": "3",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 5,
          "description": "掛起中",
          "color": "gray"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-11-25",
        "deadLine": "2025-08-07",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "Anthonne Rey Araojo Castillo",
            "identity": "FSHK280",
            "leaveStatus": 0
          },
          {
            "type": "EMPLOYEE",
            "name": "凌峰",
            "identity": "G1659743",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 3
      },
      {
        "id": 7790,
        "parentId": 6812,
        "taskNo": 202508120007,
        "title": "任务1",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 5,
          "description": "掛起中",
          "color": "gray"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-08-12",
        "deadLine": "2025-08-11",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "凌峰",
            "identity": "G1659743",
            "leaveStatus": 0
          },
          {
            "type": "EMPLOYEE",
            "name": "張占騰",
            "identity": "G1658973",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 4
      },
      {
        "id": 8792,
        "parentId": 6812,
        "taskNo": 202512220002,
        "title": "他",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 5,
          "description": "掛起中",
          "color": "gray"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-12-22",
        "deadLine": "2025-12-23",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "Alvin Patarata Aguyapa",
            "identity": "HZP00217",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 6
      },
      {
        "id": 8793,
        "parentId": 6812,
        "taskNo": 202512220004,
        "title": "任务1",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 5,
          "description": "掛起中",
          "color": "gray"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-12-22",
        "deadLine": "2025-12-24",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "凌峰",
            "identity": "G1659743",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 7
      },
      {
        "id": 8794,
        "parentId": 6812,
        "taskNo": 202512220006,
        "title": "任务1",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 5,
          "description": "掛起中",
          "color": "gray"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-12-22",
        "deadLine": "2025-12-24",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "凌峰",
            "identity": "G1659743",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 9
      },
      {
        "id": 8795,
        "parentId": 6812,
        "taskNo": 202512220008,
        "title": "任务1",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 5,
          "description": "掛起中",
          "color": "gray"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-12-22",
        "deadLine": "2025-12-24",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "凌峰",
            "identity": "G1659743",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 10
      },
      {
        "id": 8796,
        "parentId": 6812,
        "taskNo": 202512220010,
        "title": "任务1",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 5,
          "description": "掛起中",
          "color": "gray"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-12-22",
        "deadLine": "2025-12-24",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "凌峰",
            "identity": "G1659743",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 11
      },
      {
        "id": 7994,
        "parentId": 6812,
        "taskNo": 202509030008,
        "title": "ddd",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 4,
          "description": "已完成",
          "color": "#008000"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-09-03",
        "deadLine": "2025-09-04",
        "finishDate": "2025-09-03 18:14:36",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "何聪",
            "identity": "F1669075",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 100,
        "children": null,
        "number": 5
      }
    ],
    "number": 0
  },
  {
    "id": 6797,
    "parentId": 0,
    "taskNo": 202507120004,
    "title": "哈哈哈",
    "project": [
      "Others"
    ],
    "statusInfoVo": {
      "code": 2,
      "description": "處理中",
      "color": "blue"
    },
    "levelInfo": {
      "code": 2,
      "description": "中",
      "color": "#3cb371"
    },
    "createDate": "2025-07-12",
    "deadLine": "2025-07-12",
    "finishDate": "",
    "delayDays": 202,
    "proposer": {
      "employeeNo": "F1669075",
      "name": "何聪",
      "leaveStatus": 0
    },
    "supervisor": [
      {
        "type": "EMPLOYEE",
        "name": "何聪",
        "identity": "F1669075",
        "leaveStatus": 0
      },
      {
        "type": "EMPLOYEE",
        "name": "凌峰",
        "identity": "G1659743",
        "leaveStatus": 0
      }
    ],
    "progressPercent": 20,
    "children": [
      {
        "id": 7791,
        "parentId": 6797,
        "taskNo": 202508090004,
        "title": "任務test2",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 2,
          "description": "處理中",
          "color": "blue"
        },
        "levelInfo": {
          "code": 2,
          "description": "中",
          "color": "#3cb371"
        },
        "createDate": "2025-08-09",
        "deadLine": "2025-08-10",
        "finishDate": "2025-09-02 14:14:51",
        "delayDays": 173,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "凌峰",
            "identity": "G1659743",
            "leaveStatus": 0
          },
          {
            "type": "EMPLOYEE",
            "name": "張占騰",
            "identity": "G1658973",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 100,
        "children": null,
        "number": 1
      }
    ],
    "number": 0
  },
  {
    "id": 7829,
    "parentId": 0,
    "taskNo": 202508150002,
    "title": "1",
    "project": [
      "Others"
    ],
    "statusInfoVo": {
      "code": 5,
      "description": "掛起中",
      "color": "gray"
    },
    "levelInfo": {
      "code": 1,
      "description": "低",
      "color": "#9a9a9a"
    },
    "createDate": "2025-08-15",
    "deadLine": "2025-08-16",
    "finishDate": "",
    "delayDays": 0,
    "proposer": {
      "employeeNo": "F1669075",
      "name": "何聪",
      "leaveStatus": 0
    },
    "supervisor": [
      {
        "type": "employee",
        "name": "何聪",
        "identity": "F1669075",
        "leaveStatus": 0
      }
    ],
    "progressPercent": 0,
    "children": [
      {
        "id": 7830,
        "parentId": 7829,
        "taskNo": 202508150004,
        "title": "1",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 4,
          "description": "已完成",
          "color": "#008000"
        },
        "levelInfo": {
          "code": 1,
          "description": "低",
          "color": "#9a9a9a"
        },
        "createDate": "2025-08-15",
        "deadLine": "2025-08-16",
        "finishDate": "2025-08-15 08:58:34",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "何聪",
            "identity": "F1669075",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 100,
        "children": null,
        "number": 1
      },
      {
        "id": 7831,
        "parentId": 7829,
        "taskNo": 202508150006,
        "title": "2",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 4,
          "description": "已完成",
          "color": "#008000"
        },
        "levelInfo": {
          "code": 1,
          "description": "低",
          "color": "#9a9a9a"
        },
        "createDate": "2025-08-15",
        "deadLine": "2025-08-16",
        "finishDate": "2025-09-02 14:12:12",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "何聪",
            "identity": "F1669075",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 100,
        "children": null,
        "number": 2
      },
      {
        "id": 8056,
        "parentId": 7829,
        "taskNo": 202509270002,
        "title": "3",
        "project": [
          "Others"
        ],
        "statusInfoVo": {
          "code": 6,
          "description": "已撤销",
          "color": "gray"
        },
        "levelInfo": {
          "code": 1,
          "description": "低",
          "color": "#9a9a9a"
        },
        "createDate": "2025-09-27",
        "deadLine": "2025-09-28",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [
          {
            "type": "EMPLOYEE",
            "name": "凌峰",
            "identity": "G1659743",
            "leaveStatus": 0
          }
        ],
        "progressPercent": 0,
        "children": null,
        "number": 3
      }
    ],
    "number": 0
  }
];

// 解析日期字符串
function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  // 处理 "YYYY-MM-DD" 和 "YYYY-MM-DD HH:mm:ss" 格式
  const parts = dateStr.split(' ');
  const datePart = parts[0];
  const timePart = parts[1] || '00:00:00';
  
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  
  return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
}

// 规范化时间：如果开始和结束为同一天，开始时间设为00:00:00，结束时间设为23:59:59
function normalizeTimeForSameDay(start: Date, end: Date): [Date, Date] {
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  if (startDay.getTime() === endDay.getTime()) {
    const newStart = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
    const newEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
    return [newStart, newEnd];
  }
  return [start, end];
}

// 将Mock数据转换为组件Task格式
function convertMockToTask(mockTask: MockTask, displayOrder: number, parentId?: string): Task {
  let plannedStart = parseDate(mockTask.createDate);
  let plannedEnd = parseDate(mockTask.deadLine);
  let actualStart = parseDate(mockTask.createDate);
  
  // finishDate 有值 → 使用实际完成时间；为空 → undefined（由 OABarDisplay 判断延期）
  const actualEnd = mockTask.finishDate
    ? parseDate(mockTask.finishDate)
    : undefined;

  // 规范化计划时间
  [plannedStart, plannedEnd] = normalizeTimeForSameDay(plannedStart, plannedEnd);
  // 实际时间：actualEnd 可能为 undefined
  let normalizedActualStart = actualStart;
  let normalizedActualEnd = actualEnd;
  if (actualEnd) {
    [normalizedActualStart, normalizedActualEnd] = normalizeTimeForSameDay(actualStart, actualEnd);
  }
  
  // 不再拼接项目前缀到名称，项目标签将由 TitleCell 渲染
  const name = mockTask.title;
  
  // 负责人取 supervisor 数组的 name 拼接
  const assignee = mockTask.supervisor.map(s => s.name).join(", ");

  // 发起人：兼容 proposer 为对象或数组两种情况
  const proposerData = mockTask.proposer as any;
  const creator = Array.isArray(proposerData)
    ? proposerData.map((p: any) => p.name).filter(Boolean).join(", ")
    : proposerData?.name || "";
  
  const task: Task = {
    id: `Task_${mockTask.id}`,
    name,
    type: mockTask.children && mockTask.children.length > 0 ? "project" : "task",
    start: plannedStart,
    end: plannedEnd,
    plannedStart,
    plannedEnd,
    actualStart: normalizedActualStart,
    actualEnd: normalizedActualEnd,
    progress: mockTask.progressPercent,
    displayOrder,
    status: mockTask.statusInfoVo as any, // 保留完整对象
    assignee,
    hideChildren: true, // 默认折叠
  };
  
  // 添加 TitleCell 需要的扩展字段
  const extendedTask = task as any;
  extendedTask.priority = mockTask.levelInfo?.description;
  extendedTask.createdAt = mockTask.createDate;
  extendedTask.creator = creator;
  const isRead = Math.random() > 0.3; // 70% 已读
  extendedTask.read = isRead;
  extendedTask.unread = !isRead; // 未读状态（与 read 相反）
  extendedTask.focus = Math.random() > 0.8; // 20% 关注
  extendedTask.hidden = Math.random() > 0.9; // 10% 隐藏
  extendedTask.follow = Math.random() > 0.85; // 15% 跟进
  extendedTask.delayDays = mockTask.delayDays;
  extendedTask.suspend = mockTask.statusInfoVo.code === 5; // 掛起中
  extendedTask.suspendDays = extendedTask.suspend ? Math.floor(Math.random() * 10) + 1 : 0;
  extendedTask.hasChildren = mockTask.children && mockTask.children.length > 0;
  extendedTask.layer = parentId ? 2 : 1; // 简单的层级判断
  extendedTask.number = mockTask.number;
  extendedTask.parentId = mockTask.parentId;
  extendedTask.statusInfoVo = mockTask.statusInfoVo;
  extendedTask.projectTags = mockTask.project; // 保留项目数组信息用于显示
  extendedTask.category = Math.random() > 0.95 ? "6-5" : ""; // 5% 概率为会议决议
  
  // 将proposer信息添加到task中（用于isTaskDraggable判断）
  extendedTask.proposer = mockTask.proposer;
  
  if (parentId) {
    extendedTask.project = parentId;
  }
  
  // 如果状态是"掛起中"，设置为禁用
  if (mockTask.statusInfoVo.code === 5) {
    extendedTask.isDisabled = true;
  }
  
  return extendedTask;
}

// 递归转换Mock数据及其子任务（平铺格式，通过 project 字段关联父子）
function convertMockDataRecursive(mockTasks: MockTask[]): Task[] {
  const result: Task[] = [];
  let displayOrder = 1;
  
  mockTasks.forEach(mockTask => {
    const task = convertMockToTask(mockTask, displayOrder++);
    result.push(task);
    
    if (mockTask.children && mockTask.children.length > 0) {
      mockTask.children.forEach(childMock => {
        const childTask = convertMockToTask(childMock, displayOrder++, task.id);
        result.push(childTask);
      });
    }
  });
  
  return result;
}

// 将 Mock 数据转换为树形 Task 格式（children 嵌套，类似 antd Table）
function convertMockDataTree(mockTasks: MockTask[]): Task[] {
  let displayOrder = 1;

  function convertNode(mockTask: MockTask, parentId?: string): Task {
    const task = convertMockToTask(mockTask, displayOrder++, parentId);

    if (mockTask.children && mockTask.children.length > 0) {
      // 保留 children 字段（Gantt 组件会自动展平并设置 project 关联）
      (task as any).children = mockTask.children.map(child =>
        convertNode(child, task.id)
      );
    }

    return task;
  }

  return mockTasks.map(mockTask => convertNode(mockTask));
}

// 初始化任务（树形格式，children 嵌套）—— Gantt 组件内部自动展平
export function initTasksTree(
  useLargeData: boolean = false,
  parentCount: number = 100,
  childrenPerParent: number = 10
): Task[] {
  if (useLargeData) {
    const largeData = generateLargeMockData(parentCount, childrenPerParent);
    return convertMockDataTree(largeData);
  }
  return convertMockDataTree(mockData);
}

// 生成大量假数据用于性能测试
export function generateLargeMockData(
  parentCount: number = 100, // 父任务数量
  childrenPerParent: number = 10 // 每个父任务的子任务数量
): MockTask[] {
  const largeMockData: MockTask[] = [];
  const today = new Date();
  
  // 项目类型列表
  const projects = ["系統開發", "MIL", "RFQ", "Others", "MW-W (MW25)", "测试项目", "性能优化"];
  
  // 状态列表
  const statuses = [
    { code: 1, description: "待確認", color: "rgb(255,192,0)" },
    { code: 2, description: "處理中", color: "blue" },
    { code: 3, description: "待驗收", color: "#98FB98" },
    { code: 4, description: "已完成", color: "#008000" },
    { code: 5, description: "掛起中", color: "gray" },
  ];
  
  // 优先级列表
  const levels = [
    { code: 1, description: "低", color: "#9a9a9a" },
    { code: 2, description: "中", color: "#3cb371" },
    { code: 3, description: "高", color: "#ff6a6a" },
  ];
  
  // 人员列表
  const employees = [
    { employeeNo: "F1669075", name: "何聪" },
    { employeeNo: "F1669076", name: "张三" },
    { employeeNo: "F1669077", name: "李四" },
    { employeeNo: "F1669078", name: "王五" },
    { employeeNo: "F1669079", name: "赵六" },
    { employeeNo: "G1659743", name: "凌峰" },
    { employeeNo: "G1659987", name: "林俊翰" },
    { employeeNo: "FSHK280", name: "Anthonne" },
  ];
  
  // 随机获取数组元素
  const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  
  // 格式化日期为字符串
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 格式化日期时间为字符串
  const formatDateTime = (date: Date): string => {
    const dateStr = formatDate(date);
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${dateStr} ${hour}:${minute}:${second}`;
  };
  
  let taskIdCounter = 20000; // 从20000开始，避免和现有数据冲突
  let taskNoCounter = 202601260001;
  
  // 生成父任务
  for (let i = 0; i < parentCount; i++) {
    const parentId = taskIdCounter++;
    const status = randomItem(statuses);
    const level = randomItem(levels);
    const proposer = randomItem(employees);
    const projectList = [randomItem(projects)];
    
    // 随机生成时间范围（1-30天）
    const daysFromNow = Math.floor(Math.random() * 60) - 30; // -30到+30天
    const createDate = new Date(today.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
    const duration = Math.floor(Math.random() * 20) + 5; // 5-25天
    const deadLine = new Date(createDate.getTime() + duration * 24 * 60 * 60 * 1000);
    
    // 根据状态决定是否有完成时间和延期
    let finishDate = "";
    let delayDays = 0;
    let progressPercent = 0;
    
    if (status.code === 4) { // 已完成
      const finishTime = new Date(deadLine.getTime() - Math.random() * 2 * 24 * 60 * 60 * 1000);
      finishDate = formatDateTime(finishTime);
      progressPercent = 100;
    } else if (status.code === 2) { // 处理中
      progressPercent = Math.floor(Math.random() * 80) + 10; // 10-90%
      if (deadLine < today) {
        delayDays = Math.ceil((today.getTime() - deadLine.getTime()) / (24 * 60 * 60 * 1000));
      }
    } else if (status.code === 3) { // 待验收
      progressPercent = 100;
      finishDate = formatDateTime(deadLine);
    } else if (status.code === 5) { // 挂起中
      progressPercent = Math.floor(Math.random() * 50);
    }
    
    // 生成子任务
    const children: MockTask[] = [];
    for (let j = 0; j < childrenPerParent; j++) {
      const childId = taskIdCounter++;
      const childStatus = randomItem(statuses);
      const childLevel = randomItem(levels);
      const childProposer = randomItem(employees);
      
      const childCreateDate = new Date(createDate.getTime() + j * 24 * 60 * 60 * 1000);
      const childDuration = Math.floor(Math.random() * 5) + 1; // 1-5天
      const childDeadLine = new Date(childCreateDate.getTime() + childDuration * 24 * 60 * 60 * 1000);
      
      let childFinishDate = "";
      let childDelayDays = 0;
      let childProgressPercent = 0;
      
      if (childStatus.code === 4) {
        const childFinishTime = new Date(childDeadLine.getTime() - Math.random() * 1 * 24 * 60 * 60 * 1000);
        childFinishDate = formatDateTime(childFinishTime);
        childProgressPercent = 100;
      } else if (childStatus.code === 2) {
        childProgressPercent = Math.floor(Math.random() * 80) + 10;
        if (childDeadLine < today) {
          childDelayDays = Math.ceil((today.getTime() - childDeadLine.getTime()) / (24 * 60 * 60 * 1000));
        }
      } else if (childStatus.code === 3) {
        childProgressPercent = 100;
        childFinishDate = formatDateTime(childDeadLine);
      } else if (childStatus.code === 5) {
        childProgressPercent = Math.floor(Math.random() * 50);
      }
      
      children.push({
        id: childId,
        parentId,
        taskNo: taskNoCounter++,
        title: `子任务 ${i + 1}-${j + 1}`,
        project: projectList,
        statusInfoVo: childStatus,
        levelInfo: childLevel,
        createDate: formatDate(childCreateDate),
        deadLine: formatDate(childDeadLine),
        finishDate: childFinishDate,
        delayDays: childDelayDays,
        proposer: { ...childProposer, leaveStatus: 0 },
        supervisor: Math.random() > 0.5 ? [
          {
            type: "employee",
            name: randomItem(employees).name,
            identity: randomItem(employees).employeeNo,
            leaveStatus: 0
          }
        ] : [],
        progressPercent: childProgressPercent,
        children: null,
        number: j + 1
      });
    }
    
    largeMockData.push({
      id: parentId,
      parentId: 0,
      taskNo: taskNoCounter++,
      title: `性能测试父任务 ${i + 1}`,
      project: projectList,
      statusInfoVo: status,
      levelInfo: level,
      createDate: formatDate(createDate),
      deadLine: formatDate(deadLine),
      finishDate,
      delayDays,
      proposer: { ...proposer, leaveStatus: 0 },
      supervisor: [
        {
          type: "employee",
          name: randomItem(employees).name,
          identity: randomItem(employees).employeeNo,
          leaveStatus: 0
        }
      ],
      progressPercent,
      children,
      number: i
    });
  }
  
  return largeMockData;
}

// 初始化任务 - 可以选择使用真实数据或大量测试数据
export function initTasks(useLargeData: boolean = false, parentCount: number = 100, childrenPerParent: number = 10) {
  if (useLargeData) {
    console.log(`🚀 生成大量测试数据：${parentCount} 个父任务，每个 ${childrenPerParent} 个子任务，共 ${parentCount * (childrenPerParent + 1)} 个任务`);
    const largeData = generateLargeMockData(parentCount, childrenPerParent);
    return convertMockDataRecursive(largeData);
  }
  return convertMockDataRecursive(mockData);
}

// 旧的initTasks实现，保留作为参考
export function initTasksOld() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "项目A",
      id: "ProjectSample",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
      status: "處理中",
      assignee: "张三11111111111111111111111111111",
      // 不设置 plannedStart, plannedEnd, actualStart, actualEnd
      // 这样项目会根据子项自动计算时间范围
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
      // 实际时间 - 准时完成
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
      name: "需求分析",
      id: "Task 0",
      progress: 100,
      type: "task",
      project: "ProjectSample",
      displayOrder: 2,
      status: "待驗收",
      assignee: "李四",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      // 实际时间 - 提前完成
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 18, 0),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3, 16, 0),
      name: "技术调研",
      id: "Task 1",
      progress: 100,
      dependencies: ["Task 0"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 3,
      status: "待驗收",
      assignee: "王五",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      // 实际时间 - 延误开始
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5, 10, 0),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "团队讨论",
      id: "Task 2",
      progress: 60,
      dependencies: ["Task 1"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 4,
      status: "處理中",
      assignee: "赵六",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      // 实际时间 - 延误结束
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 6, 0),
      name: "开发实现",
      id: "Task 3",
      progress: 30,
      dependencies: ["Task 2"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 5,
      status: "處理中",
      assignee: "孙七",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      // 实际时间 - 进行中
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 14, 0),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 18, 0), // 还未完成
      name: "代码审查",
      id: "Task 4",
      type: "task",
      progress: 70,
      dependencies: ["Task 2"],
      project: "ProjectSample",
      displayOrder: 6,
      status: "處理中",
      assignee: "周八",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      // 实际时间 - 里程碑准时
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "版本发布",
      id: "Task 6",
      progress: currentDate.getMonth(),
      type: "milestone",
      dependencies: ["Task 4"],
      project: "ProjectSample",
      displayOrder: 7,
      status: "待驗收",
      assignee: "吴九",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      // 实际时间 - 未开始
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "暂停任务",
      id: "Task 9",
      progress: 0,
      isDisabled: true,
      type: "task",
      status: "掛起中",
      assignee: "郑十",
    },
  ];
  return tasks;
}

/**
 * 生成用于验证"点击空白行滚动到计划开始时间"功能的测试数据。
 * 每条任务的 plannedStart 间隔约 3 个月，差异明显，点击对应行时视图应跳转到对应月份。
 */
export function generateScrollTestTasks(): Task[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  // helper: 构造某年某月第N天 00:00:00
  const d = (year: number, month: number, day: number) =>
    new Date(year, month, day, 0, 0, 0);

  // 5 条任务，起止日期分别在 -6月、-3月、当月、+3月、+6月
  const offsets = [-6, -3, 0, 3, 6];
  const labels = [
    "半年前开始的任务（-6月）",
    "三个月前开始的任务（-3月）",
    "本月开始的任务（当月）",
    "三个月后开始的任务（+3月）",
    "半年后开始的任务（+6月）",
  ];

  return offsets.map((offset, idx) => {
    const startMonth = m + offset;
    const startYear = y + Math.floor(startMonth / 12);
    const normMonth = ((startMonth % 12) + 12) % 12;
    const start = d(startYear, normMonth, 1);
    const end = d(startYear, normMonth, 15);
    return {
      id: `scroll_test_${idx}`,
      name: labels[idx],
      type: "task" as const,
      start,
      end,
      plannedStart: start,
      plannedEnd: end,
      actualStart: start,
      actualEnd: end,
      progress: 30 + idx * 10,
      displayOrder: idx + 1,
      status: { code: 1, description: "待確認", color: "rgb(255,192,0)" } as any,
      assignee: "测试员",
    };
  });
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}

