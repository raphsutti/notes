# Splunk search fundamentals

<details>
  <summary>Searches examples</summary>

```
index=web status IN ("500", "503", "505")
```

```
index=web status!=200 // returns events that has status field that is not equal to 200
indexweb NOT status=200 // returns events that does not have status field also
```

Using time to filter

```
sourcetype=web earliest=-2h latest=-1h
sourcetype=web earliest=-30m@h // rounds to the nearest hour
sourcetype=web earliest=01/02/2020
```

</details>

<details>
  <summary>SPL</summary>

- Search terms
- Commands
- Functions
- Arguments
- Clauses

```
sourcetype=acc* status=200 | stats list(product_name) as "Games sold" | top "Games"
```

Search term: `sourcetype=acc* status=200`

Command: `stats`

Function: `list`

Argument:`product_name`

Clause: `as`

### Include / exclude fields
```
index=web | fields status clientip
index=web | fields - status clientip
```

### Table command
```
index=web status=200 
| table JSESSIONID, product_name, price
```

### Rename command
```
index=web status=200
| table JSESSIONID, product_name, price
| rename JSESSIONID as "User Session" product_name as "Purchase Game"
```

### Dedupe command
```
index=security
Address_Description="San Francisco"
| dedupe Username First_Name
| table Username First_Name Last_Name
```

### Sort command
```
sourcetype=vendor_sales
| table Vendor product_name sale_price
| sort - sale_price Vendor product_name
```

</details>

