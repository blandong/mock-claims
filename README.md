
## call mock service
```bash
curl -i https://mock-claims.devtooling.workers.dev/claims\?code\=claim12


```


## simulate full move

```bash

curl -X POST https://mock-claims.devtooling.workers.dev/claims/move \
  -H 'Content-Type: application/json' \
  -d '{
    "oldCode": "claim12",
    "newCode": "claim13"
  }'

```

## reset in-memory data 

```bash

curl -X POST https://mock-claims.devtooling.workers.dev/claims/reset

```
