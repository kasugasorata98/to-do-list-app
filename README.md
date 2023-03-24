# To Do List Backend

## Guide

```bash
npm install
npm run dev
```

## Features

The API has the following features:

- User authentication
- Displaying a list of to-do items
- Adding to-do items to the list
- Updating to-do items on the list
- Deleting to-do items from the list
- Deleting all to-do items from the list

## API Endpoints

The api endpoints as follows:
getAuthLink: `/api/v1/account/getAuthLink?callback=http://localhost:3000/callback \GET`
authorize: `/api/v1/account/authorize \POST`
refreshToken: `/api/v1/account/refreshToken \POST`
create: `/api/v1/list \POST`
getList: `/api/v1/list \GET`
updateList: `/api/v1/list \PATCH`
deleteList: `/api/v1/list \DELETE`

## Unit Tests

To run the unit tests, you can use the following command:

```bash
npm run test
```
