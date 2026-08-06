{
  "toolId": "300000333723055",
  "$context": {
    "etag": "1"
  },
  "createdBy": "CASEY.BROWN",
  "toolCreatedDate": "2026-08-06",
  "toolCode": "XDX_SUPPLIER_QUERY_TOOL",
  "name": "XDX Supplier Query Tool",
  "description": "Read-only supplier lookup and browsing through COE Suppliers.",
  "family": "PRC",
  "product": "SUPPLIER",
  "type": "BUSINESS_OBJECT",
  "status": "PUBLISHED",
  "version": 1,
  "userInputRequiredFlag": false,
  "userInputMessage": "",
  "subType": "",
  "namespace": "PRC.SUPPLIER",
  "specification": {
    "customFlag": false,
    "jsonSchemaName": "Tool.spec",
    "jsonSchemaVersion": "1",
    "businessObjectMetadata": {
      "functions": [
        "get_supplier_by_name",
        "get_5_suppliers",
        "getall_suppliers"
      ]
    },
    "externalRestMetadata": {
      "endpoints": [],
      "instanceURL": "",
      "extensionId": "",
      "serviceConnectionId": "",
      "authInfo": {}
    },
    "mcpConfig": {
      "credentialId": "",
      "credentialType": "none",
      "instanceURL": "",
      "tools": [],
      "type": "sse"
    },
    "kmConnectorConfig": {
      "connectorReferenceKey": "",
      "externalDocId": "",
      "externalDocVersionId": "",
      "type": "",
      "filters": [],
      "tools": []
    },
    "ragDocumentMetadata": {
      "authorization": {},
      "content": {},
      "contentArray": []
    },
    "sourceObjectCode": "ORA_PRC_SUPPLIER_COESUPPLIERS",
    "uiInput": {
      "responseSpec": "",
      "uiPatternSpec": "",
      "uiPatternType": "",
      "userInputType": ""
    }
  },
  "restTool": [
    {
      "restToolId": "300000333723056",
      "toolCode": "XDX_SUPPLIER_QUERY_TOOL",
      "toolId": "300000333723055",
      "payloadTemplate": "",
      "specification": "",
      "seededFlag": false,
      "supportedObject": {
        "supportedObjectId": "300000312973205"
      },
      "$context": {
        "etag": "1"
      }
    }
  ],
  "deepLinkTool": [],
  "retrievalDocuments": [],
  "messageDeliveryOptions": []
}
