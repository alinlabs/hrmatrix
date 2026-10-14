export default [
  {
    "id": "kpi-mfg",
    "departmentId": "dept-prod",
    "name": "Manufacturing Operation KPI",
    "period": "Monthly",
    "maxScore": 100,
    "items": [
      {
        "id": "m-1",
        "name": "Production Output Volume",
        "weight": 40,
        "target": "95% to plan"
      },
      {
        "id": "m-2",
        "name": "Scrap/Defect Rate",
        "weight": 30,
        "target": "< 2%"
      },
      {
        "id": "m-3",
        "name": "Downtime / OEE",
        "weight": 30,
        "target": "> 85%"
      }
    ]
  },
  {
    "id": "kpi-qc",
    "departmentId": "dept-qc",
    "name": "Quality Control KPI",
    "period": "Monthly",
    "maxScore": 100,
    "items": [
      {
        "id": "q-1",
        "name": "Inspection Pass Rate",
        "weight": 50,
        "target": "> 98%"
      },
      {
        "id": "q-2",
        "name": "Customer Claim Rate",
        "weight": 50,
        "target": "0%"
      }
    ]
  },
  {
    "id": "kpi-hr",
    "departmentId": "dept-hrga",
    "name": "HR & GA KPI",
    "period": "Monthly",
    "maxScore": 100,
    "items": [
      {
        "id": "h-1",
        "name": "Payroll Accuracy",
        "weight": 40,
        "target": "100%"
      },
      {
        "id": "h-2",
        "name": "Employee Turnover",
        "weight": 30,
        "target": "< 5%"
      },
      {
        "id": "h-3",
        "name": "Facility Upkeep",
        "weight": 30,
        "target": "No complaints"
      }
    ]
  }
];