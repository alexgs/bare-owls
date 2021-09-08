# How to Manually Link Accounts

FusionAuth offers an option to simply create a user. It also has an option to create a user _and_ register the use with an application in a single request. As of 2021-09-07, we only have one application, but we anticipate adding more.

## Create a user

[Documentation][1]

[1]: https://fusionauth.io/docs/v1/tech/apis/users/#create-a-user

Request: `POST /api/user/{userId}`

Example body:

```json
{
  "user": {
    "email": "skywalker@gmail.com",
    "firstName": "Luke",
    "lastName": "Skywalker",
    "password": "<password>",
    "username": "skywalker"
  }
}
```

## Create a user and register with an application in one request

[Documentation][2]

[2]: https://fusionauth.io/docs/v1/tech/apis/registrations/#create-a-user-and-registration-combined

Request: `POST /api/user/registration/{userId}`

Example body:

```json
{
  "registration": {
    "applicationId": "<applicationId>",
    "roles": [
      "JediKnight"
    ]
  },
  "skipRegistrationVerification": true,
  "skipVerification": true,
  "user": {
    "email": "skywalker@gmail.com",
    "firstName": "Luke",
    "lastName": "Skywalker",
    "password": "<password>",
    "username": "skywalker"
  }
}
```
