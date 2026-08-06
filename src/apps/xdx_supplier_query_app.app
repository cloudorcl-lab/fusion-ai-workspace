{
  "name": "XDX Supplier Query App",
  "internalName": "XDX Supplier Query App",
  "code": "XDX_SUPPLIER_QUERY_APP",
  "internalDescription": "Read-only supplier query web app backed by a one-member agent team.",
  "status": "DRAFT",
  "version": 1,
  "specification": {
    "applicationMetadata": {
      "title": "XDX Supplier Query App",
      "enableFileUpload": false,
      "pagePattern": "swimlanesPattern",
      "pageConfig": {
        "layout": "1",
        "agentContainers": [
          {
            "id": "xdx_supplier_query_panel",
            "title": "XDX Supplier Query",
            "agents": [
              "xdx_supplier_query_team"
            ],
            "panelId": "XDX_SUPPLIER_QUERY_PANEL",
            "initDisplayPromptOverride": "On initial display, retrieve and show the first five suppliers in a read-only multiRecordWidget. Do not generate actions, communications, navigation, or unsupported data.",
            "initDisplayWidgetListOverride": [
              "ORA_LAYOUT_MULTIRECORD"
            ]
          }
        ],
        "firstLane": [
          "xdx_supplier_query_panel"
        ],
        "secondLane": []
      },
      "agents": {
        "xdx_supplier_query_team": {
          "agent": "XDX_SUPPLIER_QUERY_TEAM",
          "includeInSummary": false,
          "includeInActions": false,
          "includeInCommunications": false,
          "name": "XDX Supplier Query Advisor",
          "displayPrompt": "For initial display, use the read-only multiRecordWidget to show the first five suppliers. Do not include actions, communications, navigation, or unsupported data.",
          "useDraftWorkflowWhileDeveloping": true,
          "displayWidgetList": [
            "ORA_LAYOUT_MULTIRECORD"
          ]
        }
      },
      "communications": [],
      "initiallyHideActions": "all"
    }
  }
}
