# DynamoDB 

## Identify data type of `features` attribute in the `products` table

Data type is `map`

```
root@attackdefense:~# aws --endpoint http://192.7.81.3:4567 dynamodb scan --table products --projection-expression "features" --max-items 1
{
    "Items": [
        {
            "features": {
                "M": {
                    "color": {
                        "S": "black"
                    },
                    "weight": {
                        "S": "750g"
                    },
                    "size": {
                        "S": "9"
                    }
                }
            }
        }
    ],
    "Count": 10,
    "ScannedCount": 10,
    "ConsumedCapacity": null,
    "NextToken": "eyJFeGNsdXNpdmVTdGFydEtleSI6IG51bGwsICJib3RvX3RydW5jYXRlX2Ftb3VudCI6IDF9"
}
```

## Identify partition key and sort key of table `cards`

partition key = UserId

sort key = CardNumber

```
root@attackdefense:~# aws --endpoint http://192.7.81.3:4567 dynamodb describe-table --table cards{
    "Table": {
        "AttributeDefinitions": [
            {
                "AttributeName": "UserId",
                "AttributeType": "S"
            },
            {
                "AttributeName": "CardNumber",
                "AttributeType": "S"
            }
        ],
        "TableName": "cards",
        "KeySchema": [
            {
                "AttributeName": "UserId",
                "KeyType": "HASH"
            },
            {
                "AttributeName": "CardNumber",
                "KeyType": "RANGE"
            }
        ],
        "TableStatus": "ACTIVE",
        "CreationDateTime": 1569005223.031,
        "ProvisionedThroughput": {
            "NumberOfDecreasesToday": 0,
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        },
        "TableSizeBytes": 0,
        "ItemCount": 0,
        "TableArn": "arn:aws:dynamodb:us-east-1:000000000000:table/cards",
        "TableId": "c66bd8fa-130f-4e2d-2591-214a8161"
    }
}
```

## Find value stored in `NameOnCard` where primary key is `36` and sort key of `5188-9354-2769-1431`

```
root@attackdefense:~# cat attribute_values.json
{
        ":value1": {
                "S": "36"
        },
        ":value2": {
                "S": "5188-9354-2769-1431"
        }
}
root@attackdefense:~# aws --endpoint http://192.7.81.3:4567 dynamodb query --table cards --key-condition-expression "UserId = :value1 and CardNumber = :value2" --expression-attribute-values file://attribute_values.json
{
    "Items": [
        {
            "UserId": {
                "S": "36"
            },
            "CardNumber": {
                "S": "5188-9354-2769-1431"
            },
            "NameOnCard": {
                "S": "Brynne Guthrie"
            },
            "Expiry": {
                "S": "20-05-17"
            },
            "RegisteredNumber": {
                "S": "0537416572"
            }
        }
    ],
    "Count": 1,
    "ScannedCount": 1,
    "ConsumedCapacity": null
}
```

## Count number of products with rating of more than 4.5

Check data type of `Rating` (Number)
```
root@attackdefense:~# aws --endpoint http://192.7.81.3:4567 dynamodb scan --table products --max-items 1{
    "Items": [
        {
            "ProductId": {
                "S": "2"
            },
            "PublishOn": {
                "S": "2018-01-01"
            },
            "ProductName": {
                "S": "Puma Sneakers"
            },
            "ProductDescription": {
                "S": "Puma Shoes at cheap Price"
            },
            "Category": {
                "S": "Footwear"
            },
            "Rating": {
                "N": "4"
            },
            "Price": {
                "S": "145$"
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
                        "S": "black"
                    },
                    "weight": {
                        "S": "750g"
                    },
                    "size": {
                        "S": "9"
                    }
                }
            }
        }
    ],
    "Count": 10,
    "ScannedCount": 10,
    "ConsumedCapacity": null,
    "NextToken": "eyJFeGNsdXNpdmVTdGFydEtleSI6IG51bGwsICJib3RvX3RydW5jYXRlX2Ftb3VudCI6IDF9"
}
```

4 products found with rating of >=4.5

```
root@attackdefense:~# cat attribute_values.json{
        ":value":{
                "N":"4.5"
        }
}
root@attackdefense:~# aws --endpoint http://192.7.81.3:4567 dynamodb scan --table products --filter-expression "Rating > :value"--expression-attribute-values file://attribute_values.json
{
    "Items": [
        {
            "ProductId": {
                "S": "8"
            },
            "PublishOn": {
                "S": "2018-01-01"
            },
            "ProductName": {
                "S": "Gucci Wallet"
            },
            "ProductDescription": {
                "S": "Limited Edition Gucci Wallet"
            },
            "Category": {
                "S": "Purse"
            },
            "Rating": {
                "N": "5"
            },
            "Price": {
                "S": "745$"
            },
            "Reviews": {
                "M": {}
            },
            "SellerId": {
                "S": "3"
            },
            "features": {
                "M": {
                    "weight": {
                        "S": "300g"
                    },
                    "Color": {
                        "S": "Grey"
                    }
                }
            }
        },
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
        },
        {
            "ProductId": {
                "S": "5"
            },
            "PublishOn": {
                "S": "2018-01-01"
            },
            "ProductName": {
                "S": "Samsung LED TV"
            },
            "ProductDescription": {
                "S": "Limited Time Discount on Samsung LED TV"
            },
            "Category": {
                "S": "Electronics"
            },
            "Rating": {
                "N": "4.75"
            },
            "Price": {
                "S": "445$"
            },
            "Reviews": {
                "M": {}
            },
            "SellerId": {
                "S": "1"
            },
            "features": {
                "M": {
                    "weight": {
                        "S": "7000g"
                    },
                    "type": {
                        "S": "Wall Mount"
                    },
                    "warranty": {
                        "S": "2 years"
                    },
                    "size": {
                        "S": "64in"
                    }
                }
            }
        },
        {
            "ProductId": {
                "S": "10"
            },
            "PublishOn": {
                "S": "2018-01-01"
            },
            "ProductName": {
                "S": "Sony Ear Phones"
            },
            "ProductDescription": {
                "S": "Limited Edition Sony Ear Phones"
            },
            "Category": {
                "S": "Accessories"
            },
            "Rating": {
                "N": "5"
            },
            "Price": {
                "S": "55$"
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
    "Count": 4,
    "ScannedCount": 10,
    "ConsumedCapacity": null
}
```

## Delete order with OrderId of 15 from `orders` table

```
root@attackdefense:~# cat key.json
{
        "OrderId": {
                "S": "15"
        }
}
root@attackdefense:~# aws --endpoint http://192.7.81.3:4567 dynamodb delete-item --table orders --key file://key.jsonroot@attackdefense:~# aws --endpoint http://192.7.81.3:4567 dynamodb get-item --table orders --key file://key.json
root@attackdefense:~#
```

## Delete table `order` from the DynamoDB server

```
root@attackdefense:~# aws --endpoint http://192.7.81.3:4567 dynamodb delete-table --table orders
{
    "TableDescription": {
        "AttributeDefinitions": [
            {
                "AttributeName": "OrderId",
                "AttributeType": "S"
            }
        ],
        "TableName": "orders",
        "KeySchema": [
            {
                "AttributeName": "OrderId",
                "KeyType": "HASH"
            }
        ],
        "TableStatus": "DELETING",
        "CreationDateTime": 1569005086.548,
        "ProvisionedThroughput": {
            "NumberOfDecreasesToday": 0,
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        },
        "TableSizeBytes": 0,
        "ItemCount": 0,
        "TableArn": "arn:aws:dynamodb:us-east-1:000000000000:table/orders",
        "TableId": "9fc66df4-d2c8-4d6d-3aab-4bfd4d21"
    }
}
root@attackdefense:~# aws --endpoint http://192.7.81.3:4567 dynamodb list-tables
{
    "TableNames": [
        "cards",
        "products",
        "sellers",
        "users"
    ]
}
```


