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
    "id": 9999,
    "parentId": 0,
    "taskNo": 202601250001,
    "title": "实际时间测试任务",
    "project": [
      "时间测试"
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
    "createDate": "2026-01-20",
    "deadLine": "2026-01-30",
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
    "progressPercent": 50,
    "children": [
      {
        "id": 10001,
        "parentId": 9999,
        "taskNo": 202601250002,
        "title": "同一天完成的任务1",
        "project": [
          "时间测试"
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
        "createDate": "2026-01-22",
        "deadLine": "2026-01-22",
        "finishDate": "2026-01-22 18:30:00",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 100,
        "children": null,
        "number": 1
      },
      {
        "id": 10002,
        "parentId": 9999,
        "taskNo": 202601250003,
        "title": "同一天完成的任务2（上午开始下午结束）",
        "project": [
          "时间测试"
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
        "createDate": "2026-01-23",
        "deadLine": "2026-01-23",
        "finishDate": "2026-01-23 17:00:00",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 100,
        "children": null,
        "number": 2
      },
      {
        "id": 10003,
        "parentId": 9999,
        "taskNo": 202601250004,
        "title": "跨两天完成的任务",
        "project": [
          "时间测试"
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
        "createDate": "2026-01-24",
        "deadLine": "2026-01-25",
        "finishDate": "2026-01-25 14:30:00",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 100,
        "children": null,
        "number": 3
      },
      {
        "id": 10004,
        "parentId": 9999,
        "taskNo": 202601250005,
        "title": "跨多天完成的任务（3天）",
        "project": [
          "时间测试"
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
        "createDate": "2026-01-21",
        "deadLine": "2026-01-24",
        "finishDate": "2026-01-24 16:00:00",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 100,
        "children": null,
        "number": 4
      },
      {
        "id": 10005,
        "parentId": 9999,
        "taskNo": 202601250006,
        "title": "进行中-同一天内（今天）",
        "project": [
          "时间测试"
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
        "createDate": "2026-01-25",
        "deadLine": "2026-01-25",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 60,
        "children": null,
        "number": 5
      },
      {
        "id": 10006,
        "parentId": 9999,
        "taskNo": 202601250007,
        "title": "进行中-跨天执行",
        "project": [
          "时间测试"
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
        "createDate": "2026-01-23",
        "deadLine": "2026-01-26",
        "finishDate": "",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 45,
        "children": null,
        "number": 6
      },
      {
        "id": 10007,
        "parentId": 9999,
        "taskNo": 202601250008,
        "title": "延期任务-从昨天到今天",
        "project": [
          "时间测试"
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
        "createDate": "2026-01-24",
        "deadLine": "2026-01-24",
        "finishDate": "",
        "delayDays": 1,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 75,
        "children": null,
        "number": 7
      },
      {
        "id": 10008,
        "parentId": 9999,
        "taskNo": 202601250009,
        "title": "跨周完成的任务（7天）",
        "project": [
          "时间测试"
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
        "createDate": "2026-01-15",
        "deadLine": "2026-01-22",
        "finishDate": "2026-01-22 10:15:00",
        "delayDays": 0,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 100,
        "children": null,
        "number": 8
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
    "deadLine": "2026-01-21",
    "finishDate": "",
    "delayDays": 1,
    "proposer": {
      "employeeNo": "F1669075",
      "name": "张三",
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
        "delayDays": 2,
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
        "delayDays": 2,
        "proposer": {
          "employeeNo": "F1669075",
          "name": "何聪",
          "leaveStatus": 0
        },
        "supervisor": [],
        "progressPercent": 0,
        "children": null,
        "number": 2
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
    "delayDays": 5,
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
    "deadLine": "2025-12-26",
    "finishDate": "",
    "delayDays": 27,
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
        "delayDays": 4,
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
    "delayDays": 28,
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
    "delayDays": 194,
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
        "delayDays": 165,
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
  },
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
    "deadLine": "2025-07-12",
    "finishDate": "",
    "delayDays": 194,
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
        "delayDays": 194,
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
        "delayDays": 194,
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
        "delayDays": 194,
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
        "delayDays": 194,
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
        "delayDays": 2,
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

// 将Mock数据转换为组件Task格式
function convertMockToTask(mockTask: MockTask, displayOrder: number, parentId?: string): Task {
  const plannedStart = parseDate(mockTask.createDate);
  const plannedEnd = parseDate(mockTask.deadLine);
  const actualStart = parseDate(mockTask.createDate);
  
  // 计算actualEnd：如果有finishDate则使用，否则根据delayDays和状态计算
  let actualEnd: Date;
  if (mockTask.finishDate) {
    // 已完成的任务，使用finishDate
    actualEnd = parseDate(mockTask.finishDate);
  } else {
    // 未完成的任务
    const statusCode = mockTask.statusInfoVo?.code;
    const isProcessing = statusCode === 2; // 处理中/處理中
    
    if (isProcessing && mockTask.delayDays > 0) {
      // 处理中状态且有延期天数，计算actualEnd = plannedEnd + delayDays
      actualEnd = new Date(plannedEnd.getTime() + mockTask.delayDays * 24 * 60 * 60 * 1000);
    } else if (isProcessing) {
      // 处理中状态但没有延期天数，使用当前时间（确保延期条形区能显示）
      const now = new Date();
      actualEnd = now > plannedEnd ? now : plannedEnd;
    } else {
      // 其他状态，使用plannedEnd
      actualEnd = plannedEnd;
    }
  }
  
  // 拼接项目前缀到名称：【系統開發】test 或 【a】【b】title
  const projectPrefix = mockTask.project && mockTask.project.length > 0
    ? mockTask.project.map(p => `【${p}】`).join('')
    : '';
  const name = `${projectPrefix}${mockTask.title}`;
  
  // 负责人取 proposer 的 name
  const assignee = mockTask.proposer.name;
  
  const task: Task = {
    id: `Task_${mockTask.id}`,
    name,
    type: mockTask.children && mockTask.children.length > 0 ? "project" : "task",
    start: plannedStart,
    end: plannedEnd,
    plannedStart,
    plannedEnd,
    actualStart,
    actualEnd,
    progress: mockTask.progressPercent,
    displayOrder,
    status: mockTask.statusInfoVo as any, // 保留完整对象
    assignee,
    hideChildren: false,
  };
  
  // 将proposer信息添加到task中（用于isTaskDraggable判断）
  (task as any).proposer = mockTask.proposer;
  
  if (parentId) {
    task.project = parentId;
  }
  
  // 如果状态是"掛起中"，设置为禁用
  if (mockTask.statusInfoVo.code === 5) {
    task.isDisabled = true;
  }
  
  return task;
}

// 递归转换Mock数据及其子任务
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

export function initTasks() {
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

