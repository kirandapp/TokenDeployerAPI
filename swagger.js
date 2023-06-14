const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


// const swaggerOptions = {
//     swaggerDefinition: {
//       openapi: '3.0.0',
//       info: {
//         title: 'Token Deployer',
//         version: '1.0.0',
//         description: 'API documentation for Your API',
//       },
//     },
//     apis: ['./scripts/app.js'], // Path to your API route files
//   };
  
//   module.exports = function (app) {
//     const swaggerSpec = swaggerJsdoc(swaggerOptions);
  
//     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//   };

const swaggerOptions = {
    swaggerDefinition: {
        "openapi": "3.0.0",
        "info": {
          "title": "Contract Deployment API",
          "version": "1.0.0",
          "description": "API for deploying smart contracts"
        },
        "servers": [
          {
            "url": "http://localhost:3000"
          }
        ],
        "paths": {
          "/": {
            "get": {
              "summary": "Welcome",
              "responses": {
                "200": {
                  "description": "Returns a welcome message",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "message": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "message": "Hi"
                      }
                    }
                  }
                }
              }
            }
          },
          "/deploy-bigeyes": {
            "post": {
              "summary": "Deploy BigEyes contract",
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "contractName": {
                          "type": "string"
                        },
                        "templateName": {
                          "type": "string"
                        },
                        "name": {
                          "type": "string"
                        },
                        "symbol": {
                          "type": "string"
                        },
                        "decimals": {
                          "type": "integer"
                        },
                        "totalSupply": {
                          "type": "string"
                        },
                        "privateKey": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "contractName",
                        "templateName",
                        "name",
                        "symbol",
                        "decimals",
                        "totalSupply",
                        "privateKey"
                      ]
                    },
                    "example": {
                      "contractName": "MyContract",
                      "templateName": "TemplateContractName",
                      "name": "TokenName",
                      "symbol": "TKN",
                      "decimals": 18,
                      "totalSupply": "1000000",
                      "privateKey": "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "Contract deployed successfully",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "address": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "address": "0x0123456789abcdef0123456789abcdef01234567"
                      }
                    }
                  }
                },
                "400": {
                  "description": "Bad request",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "error": "Contract compilation failed"
                      }
                    }
                  }
                },
                "500": {
                  "description": "Internal server error",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "error": "Internal server error"
                      }
                    }
                  }
                }
              }
            }
          },
          "/deploy-neocypherpunk": {
            "post": {
              "summary": "Deploy neocypherpunk contract",
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "contractName": {
                          "type": "string"
                        },
                        "templateName": {
                          "type": "string"
                        },
                        "router": {
                            "type": "string"
                        },
                        "name": {
                          "type": "string"
                        },
                        "symbol": {
                          "type": "string"
                        },
                        "privateKey": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "contractName",
                        "templateName",
                        "router",
                        "name",
                        "symbol",
                        "privateKey"
                      ]
                    },
                    "example": {
                      "contractName": "MyContract",
                      "templateName": "TemplateContractName",
                      "router": "RouterContractAddress",
                      "name": "TokenName",
                      "symbol": "TKN",
                      "privateKey": "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "Contract deployed successfully",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "address": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "address": "0x0123456789abcdef0123456789abcdef01234567"
                      }
                    }
                  }
                },
                "400": {
                  "description": "Bad request",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "error": "Contract compilation failed"
                      }
                    }
                  }
                },
                "500": {
                  "description": "Internal server error",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "error": "Internal server error"
                      }
                    }
                  }
                }
              }
            }
          },
          "/deploy-dejitarutsuko": {
            "post": {
              "summary": "Deploy dejitarutsuko contract",
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "contractName": {
                          "type": "string"
                        },
                        "templateName": {
                          "type": "string"
                        },
                        "router": {
                            "type": "string"
                        },
                        "name": {
                          "type": "string"
                        },
                        "symbol": {
                          "type": "string"
                        },
                        "decimals": {
                            "type": "integer"
                        },
                        "totalSupply": {
                            "type": "string"
                        },
                        "privateKey": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "contractName",
                        "templateName",
                        "router",
                        "name",
                        "symbol",
                        "decimals",
                        "totalSupply",
                        "privateKey"
                      ]
                    },
                    "example": {
                      "contractName": "MyContract",
                      "templateName": "TemplateContractName",
                      "router": "RouterContractAddress",
                      "name": "TokenName",
                      "symbol": "TKN",
                      "decimals": 18,
                      "totalSupply": "1000000",
                      "privateKey": "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "Contract deployed successfully",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "address": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "address": "0x0123456789abcdef0123456789abcdef01234567"
                      }
                    }
                  }
                },
                "400": {
                  "description": "Bad request",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "error": "Contract compilation failed"
                      }
                    }
                  }
                },
                "500": {
                  "description": "Internal server error",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "error": "Internal server error"
                      }
                    }
                  }
                }
              }
            }
          },
          "/deploy-jeju": {
            "post": {
              "summary": "Deploy jeju contract",
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "contractName": {
                          "type": "string"
                        },
                        "templateName": {
                          "type": "string"
                        },
                        "router": {
                            "type": "string"
                        },
                        "name": {
                          "type": "string"
                        },
                        "symbol": {
                          "type": "string"
                        },
                        "privateKey": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "contractName",
                        "templateName",
                        "router",
                        "name",
                        "symbol",
                        "privateKey"
                      ]
                    },
                    "example": {
                      "contractName": "MyContract",
                      "templateName": "TemplateContractName",
                      "router": " ",
                      "name": "TokenName",
                      "symbol": "TKN",
                      "privateKey": "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "Contract deployed successfully",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "address": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "address": "0x0123456789abcdef0123456789abcdef01234567"
                      }
                    }
                  }
                },
                "400": {
                  "description": "Bad request",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "error": "Contract compilation failed"
                      }
                    }
                  }
                },
                "500": {
                  "description": "Internal server error",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "error": "Internal server error"
                      }
                    }
                  }
                }
              }
            }
          },
          "/deploy-pepetoken": {
            "post": {
              "summary": "Deploy pepetoken contract",
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "contractName": {
                          "type": "string"
                        },
                        "templateName": {
                          "type": "string"
                        },
                        "name": {
                          "type": "string"
                        },
                        "symbol": {
                          "type": "string"
                        },
                        "totalSupply": {
                            "type": "string"
                        },
                        "privateKey": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "contractName",
                        "templateName",
                        "name",
                        "symbol",
                        "totalSupply",
                        "privateKey"
                      ]
                    },
                    "example": {
                      "contractName": "MyContract",
                      "templateName": "TemplateContractName",
                      "name": "TokenName",
                      "symbol": "TKN",
                      "totalSupply": "1000000",
                      "privateKey": "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "Contract deployed successfully",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "address": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "address": "0x0123456789abcdef0123456789abcdef01234567"
                      }
                    }
                  }
                },
                "400": {
                  "description": "Bad request",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "error": "Contract compilation failed"
                      }
                    }
                  }
                },
                "500": {
                  "description": "Internal server error",
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "properties": {
                          "error": {
                            "type": "string"
                          }
                        }
                      },
                      "example": {
                        "error": "Internal server error"
                      }
                    }
                  }
                }
              }
            }
          }
        },
    },
    apis: ['./scripts/app.js'], // Path to your API route files
};
  
module.exports = function (app) {
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
  
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

  
  
  