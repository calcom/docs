export const openApiSpec = {
    "openapi": "3.0.3",
    "servers": [
      {
        "url": "https://api.cal.com/v1"
      }
    ],
    "externalDocs": {
      "url": "https://docs.cal.com",
      "description": "Find more info at our main docs: https://docs.cal.com/"
    },
    "info": {
      "title": "@calcom/api: Public API for Cal.com",
      "version": "1.0.0"
    },
    "components": {
      "securitySchemes": {
        "ApiKeyAuth": {
          "type": "apiKey",
          "in": "query",
          "name": "apiKey"
        }
      },
      "schemas": {
        "ArrayOfBookings": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Booking"
          }
        },
        "Attendee": {
          "properties": {
            "id": {
              "type": "number"
            },
            "bookingId": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "timeZone": {
              "type": "string"
            }
          }
        },
        "ArrayOfAttendees": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Attendee"
          }
        },
        "Booking": {
          "properties": {
            "id": {
              "type": "number"
            },
            "description": {
              "type": "string"
            },
            "eventTypeId": {
              "type": "number"
            },
            "uid": {
              "type": "string",
              "format": "uuid"
            },
            "title": {
              "type": "string"
            },
            "startTime": {
              "type": "string",
              "format": "date-time"
            },
            "endTime": {
              "type": "string",
              "format": "date-time"
            },
            "timeZone": {
              "type": "string",
              "example": "Europe/London"
            },
            "attendees": {
              "type": "array",
              "items": {
                "properties": {
                  "email": {
                    "type": "string",
                    "example": "example@cal.com"
                  },
                  "name": {
                    "type": "string"
                  },
                  "timeZone": {
                    "type": "string",
                    "example": "Europe/London"
                  },
                  "locale": {
                    "type": "string",
                    "example": "en"
                  }
                }
              }
            },
            "user": {
              "properties": {
                "email": {
                  "type": "string",
                  "example": "example@cal.com"
                },
                "name": {
                  "type": "string"
                },
                "timeZone": {
                  "type": "string",
                  "example": "Europe/London"
                },
                "locale": {
                  "type": "string",
                  "example": "en"
                }
              }
            },
            "payment": {
              "items": {
                "properties": {
                  "id": {
                    "type": "number",
                    "example": 1
                  },
                  "success": {
                    "type": "boolean",
                    "example": true
                  },
                  "paymentOption": {
                    "type": "string",
                    "example": "ON_BOOKING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "security": [
      {
        "ApiKeyAuth": []
      }
    ],
    "tags": [
      {
        "name": "users"
      },
      {
        "name": "event-types"
      },
      {
        "name": "bookings"
      },
      {
        "name": "attendees"
      },
      {
        "name": "payments"
      },
      {
        "name": "schedules"
      },
      {
        "name": "teams"
      },
      {
        "name": "memberships"
      },
      {
        "name": "availabilities",
        "description": "Allows modifying unique availabilities tied to a schedule."
      },
      {
        "name": "custom-inputs"
      },
      {
        "name": "event-references"
      },
      {
        "name": "booking-references"
      },
      {
        "name": "destination-calendars"
      },
      {
        "name": "selected-calendars"
      }
    ],
    "paths": {
      "/attendees": {
        "get": {
          "operationId": "listAttendees",
          "summary": "Find all attendees",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "type": "string",
              "description": "Your API key"
            }
          ],
          "tags": [
            "attendees"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArrayOfAttendees"
                  },
                  "examples": {
                    "attendee": {
                        "value": 
                        {
                          "attendees": [
                            {
                              "id": 251,
                              "bookingId": 313,
                              "name": "John Doe",
                              "email": "john.doe@example.com",
                              "timeZone": "Asia/Jerusalem"
                            },
                            {
                              "id": 252,
                              "bookingId": 314,
                              "name": "Jane Doe",
                              "email": "jane.doe@example.com",
                              "timeZone": "Asia/Dubai"
                            },
                          ]  
                        }
                      }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No attendees were found"
            }
          }
        },
        "post": {
          "operationId": "addAttendee",
          "summary": "Creates a new attendee",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "type": "string",
              "description": "Your API key"
            }
          ],
          "requestBody": {
            "description": "Create a new attendee related to one of your bookings",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "bookingId",
                    "name",
                    "email",
                    "timeZone"
                  ],
                  "properties": {
                    "bookingId": {
                      "type": "number",
                      "description": "ID of the booking where you wish to add this attendee",
                    },
                    "email": {
                      "type": "string",
                      "format": "email",
                      "description": "Email of the attendee",
                    },
                    "name": {
                      "type": "string",
                      "description": "Name of the attendee",
                    },
                    "timeZone": {
                      "type": "string",
                      "description": "TimeZone of the attendee",
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "attendees"
          ],
          "responses": {
            "201": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Attendee"
                  },
                  "examples": {
                    "attendee": {
                        "value": {
                          "attendee": {
                            "id": 255,
                            "bookingId": 313,
                            "name": "Justin Doe",
                            "email": "justin.doe@example.com",
                            "timeZone": "Asia/Jerusalem"
                          },
                          "message": "Attendee created successfully"
                        }
                      }
                  }
                }
              }
            },
            "400": {
              "description": "Bad request. Attendee body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "403": {
              "description": "Forbidden"
            }            
          }
        }
      },
      "/attendees/{id}": {
        "delete": {
          "operationId": "removeAttendeeById",
          "summary": "Remove an existing attendee",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "type": "string",
              "description": "Your API key"
            },
            {
              "in": "path",
              "name": "id",
              "type": "integer",
              "required": true,
              "description": "ID of the attendee to delete"
            }
          ],
          "tags": [
            "attendees"
          ],
          "responses": {
            "200": {
              "description": "Attendee with id: {id} deleted successfully",
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "403": {
              "description": "Forbidden"
            }
          }
        },
        "get": {
          "operationId": "getAttendeeById",
          "summary": "Find an attendee",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "type": "string",
              "description": "Your API key"
            },
            {
              "in": "path",
              "name": "id",
              "type": "integer",
              "required": true,
              "description": "ID of the attendee to get"
            }
          ],
          "tags": [
            "attendees"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Attendee"
                  },
                  "examples": {
                    "attendee": {
                        "value": {
                          "attendee": {
                            "id": 251,
                            "bookingId": 313,
                            "name": "John Doe",
                            "email": "john.doe@example.com",
                            "timeZone": "Asia/Jerusalem"
                          }
                        }
                      }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "403": {
              "description": "Forbidden"
            }
          }
        },
        "patch": {
          "operationId": "editAttendeeById",
          "summary": "Edit an existing attendee",
          "requestBody": {
            "description": "Edit an existing attendee related to one of your bookings",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email",
                      "description": "Email of the attendee",
                    },
                    "name": {
                      "type": "string",
                      "description": "Name of the attendee",
                    },
                    "timeZone": {
                      "type": "string",
                      "description": "Timezone of the attendee when booking",
                    }
                  }
                }
              }
            }
          },
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            },
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer",
              },
              "required": true,
              "description": "ID of the attendee to get"
            }
          ],
          "tags": [
            "attendees"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Attendee"
                  },
                  "examples": {
                    "attendee": {
                        "value": {
                          "attendee": {
                            "id": 251,
                            "bookingId": 313,
                            "name": "John Doe",
                            "email": "john.doe@example.com",
                            "timeZone": "Asia/Jerusalem"
                          }
                        }
                      }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "403": {
              "description": "Forbidden"
            }
          }
        }
      },
      "/availabilities": {
        "post": {
          "operationId": "addAvailability",
          "summary": "Creates a new availability",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "type": "string",
              "description": "Your API key"
            }
          ],
          "requestBody": {
            "description": "Edit an existing availability related to one of your bookings",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "scheduleId",
                    "startTime",
                    "endTime"
                  ],
                  "properties": {
                    "days": {
                      "type": "array",
                      "description": "Array of integers depicting days of the week",
                      "items": {
                        "type": "integer",
                        "enum": [
                          0,
                          1,
                          2,
                          3,
                          4,
                          5,
                          6
                        ]
                      }
                    },
                    "scheduleId": {
                      "type": "integer",
                      "description": "ID of schedule this availability is associated with"
                    },
                    "startTime": {
                      "type": "DateTime",
                      "description": "Start time of the availability"
                    },
                    "endTime": {
                      "type": "DateTime",
                      "description": "End time of the availability"
                    }
                  }
                },
                "examples": {
                  "availability": {
                    "startTime": "1970-01-01T09:00:00.000Z",
                    "endTime": "1970-01-01T17:00:00.000Z",
                    "scheduleId": 272,
                    "days": [2,3,4] 
                  }
                }
              }
            }
          },
          "tags": [
            "availabilities"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/availability"
          },
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Availability"
                  },
                  "examples": {
                    "availability": {
                        "value": {
                            "availability": {
                                "id": 12345566,
                                "startTime": "1970-01-01T09:00:00.000Z",
                                "endTime": "1970-01-01T17:00:00.000Z",
                                "date": null,
                                "scheduleId": 272,
                                "days": [
                                    2,
                                    3,
                                    4
                                ],
                                "Schedule": {
                                    "userId": 12344123
                                }
                            },
                            "message": "Availability created successfully"            
                        }
                      }
                  }
                }
              }
            },
            "400": {
              "description": "Bad request. Availability body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/availabilities/{id}": {
        "delete": {
          "operationId": "removeAvailabilityById",
          "summary": "Remove an existing availability",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "type": "integer",
              "required": true,
              "description": "ID of the availability to delete"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "type": "integer",
              "description": "Your API key"
            }
          ],
          "tags": [
            "availabilities"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/availability"
          },
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Availability"
                  },
                  "examples": {
                    "availability": {
                        "value": {
                          "message": "Availability with id: {id} deleted successfully"
                        }          
                      }
                  }
                }
              }
            },
            "400": {
              "description": "Bad request. Availability id is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        },
        "get": {
          "operationId": "getAvailabilityById",
          "summary": "Find an availability",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "type": "integer",
              "required": true,
              "description": "ID of the availability to get"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "type": "integer",
              "description": "Your API key"
            }
          ],
          "tags": [
            "availabilities"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/availability"
          },
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Availability"
                  },
                  "examples": {
                    "availability": {
                        "value": {
                            "availability": {
                                "id": 12345566,
                                "startTime": "1970-01-01T09:00:00.000Z",
                                "endTime": "1970-01-01T17:00:00.000Z",
                                "date": null,
                                "scheduleId": 272,
                                "days": [
                                    2,
                                    3,
                                    4
                                ],
                                "Schedule": {
                                    "userId": 12344123
                                }
                            }, 
                        }
                      }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid"
            },
            "404": {
              "description": "Availability not found"
            }
          }
        },
        "patch": {
          "operationId": "editAvailabilityById",
          "summary": "Edit an existing availability",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "description": "Your API key",
              "type": "integer"
            },
            {
              "in": "path",
              "name": "id",
              "required": true,
              "type": "integer",
              "description": "ID of the availability to edit"
            }
          ],
          "requestBody": {
            "description": "Edit an existing availability related to one of your bookings",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "days": {
                      "type": "array",
                      "description": "Array of integers depicting weekdays",
                      "items": {
                        "type": "integer",
                        "enum": [
                          0,
                          1,
                          2,
                          3,
                          4,
                          5
                        ]
                      }
                    },
                    "scheduleId": {
                      "type": "integer",
                      "description": "ID of schedule this availability is associated with"
                    },
                    "startTime": {
                      "type": "string",
                      "description": "Start time of the availability"
                    },
                    "endTime": {
                      "type": "string",
                      "description": "End time of the availability"
                    }
                  }
                },
                "examples": {
                  "availability": {
                      "days": [
                        1,
                        3,
                        5
                      ],
                  }
                }
              }
            }
          },
          "tags": [
            "availabilities"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/availability"
          },
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Availability"
                  },
                  "examples": {
                    "availability": {
                        "value": {
                            "availability": {
                                "id": 12345566,
                                "startTime": "1970-01-01T09:00:00.000Z",
                                "endTime": "1970-01-01T17:00:00.000Z",
                                "date": null,
                                "scheduleId": 272,
                                "days": [
                                    1,
                                    3,
                                    5
                                ],
                                "Schedule": {
                                    "userId": 12344123
                                }
                            }, 
                        }
                      }
                  }
                }
              }
            },
            "400": {
              "description": "Bad request. Availability body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/teams/{teamId}/availability": {
        "get": {
          "summary": "Find team availability",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "example": "1234abcd5678efgh",
              "description": "Your API key"
            },
            {
              "in": "path",
              "name": "teamId",
              "required": true,
              "schema": {
                "type": "integer"
              },
              "example": 123,
              "description": "ID of the team to fetch the availability for"
            },
            {
              "in": "query",
              "name": "dateFrom",
              "schema": {
                "type": "string",
                "format": "date"
              },
              "example": "2023-05-14 00:00:00",
              "description": "Start Date of the availability query"
            },
            {
              "in": "query",
              "name": "dateTo",
              "schema": {
                "type": "string",
                "format": "date"
              },
              "example": "2023-05-20 00:00:00",
              "description": "End Date of the availability query"
            },
            {
              "in": "query",
              "name": "eventTypeId",
              "schema": {
                "type": "integer"
              },
              "example": 123,
              "description": "Event Type ID of the event type to fetch the availability for"
            }
          ],
          "operationId": "team-availability",
          "tags": [
            "availability"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "example": {
                      "busy": [
                        {
                          "start": "2023-05-14T10:00:00.000Z",
                          "end": "2023-05-14T11:00:00.000Z",
                          "title": "Team meeting between Alice and Bob"
                        },
                        {
                          "start": "2023-05-15T14:00:00.000Z",
                          "end": "2023-05-15T15:00:00.000Z",
                          "title": "Project review between Carol and Dave"
                        },
                        {
                          "start": "2023-05-16T09:00:00.000Z",
                          "end": "2023-05-16T10:00:00.000Z"
                        },
                        {
                          "start": "2023-05-17T13:00:00.000Z",
                          "end": "2023-05-17T14:00:00.000Z"
                        }
                      ],
                      "timeZone": "America/New_York",
                      "workingHours": [
                        {
                          "days": [
                            1,
                            2,
                            3,
                            4,
                            5
                          ],
                          "startTime": 540,
                          "endTime": 1020,
                          "userId": 101
                        }
                      ],
                      "dateOverrides": [
                        {
                          "date": "2023-05-15",
                          "startTime": 600,
                          "endTime": 960,
                          "userId": 101
                        }
                      ],
                      "currentSeats": 4
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "Team not found | Team has no members"
            }
          }
        }
      },
      "/availability": {
        "get": {
          "summary": "Find user availability",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "example": "1234abcd5678efgh",
              "description": "Your API key"
            },
            {
              "in": "query",
              "name": "userId",
              "schema": {
                "type": "integer"
              },
              "example": 101,
              "description": "ID of the user to fetch the availability for"
            },
            {
              "in": "query",
              "name": "username",
              "schema": {
                "type": "string"
              },
              "example": "alice",
              "description": "username of the user to fetch the availability for"
            },
            {
              "in": "query",
              "name": "dateFrom",
              "schema": {
                "type": "string",
                "format": "date"
              },
              "example": "2023-05-14 00:00:00",
              "description": "Start Date of the availability query"
            },
            {
              "in": "query",
              "name": "dateTo",
              "schema": {
                "type": "string",
                "format": "date"
              },
              "example": "2023-05-20 00:00:00",
              "description": "End Date of the availability query"
            },
            {
              "in": "query",
              "name": "eventTypeId",
              "schema": {
                "type": "integer"
              },
              "example": 123,
              "description": "Event Type ID of the event type to fetch the availability for"
            }
          ],
          "operationId": "user-availability",
          "tags": [
            "availability"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "example": {
                      "busy": [
                        {
                          "start": "2023-05-14T10:00:00.000Z",
                          "end": "2023-05-14T11:00:00.000Z",
                          "title": "Team meeting between Alice and Bob"
                        },
                        {
                          "start": "2023-05-15T14:00:00.000Z",
                          "end": "2023-05-15T15:00:00.000Z",
                          "title": "Project review between Carol and Dave"
                        },
                        {
                          "start": "2023-05-16T09:00:00.000Z",
                          "end": "2023-05-16T10:00:00.000Z"
                        },
                        {
                          "start": "2023-05-17T13:00:00.000Z",
                          "end": "2023-05-17T14:00:00.000Z"
                        }
                      ],
                      "timeZone": "America/New_York",
                      "workingHours": [
                        {
                          "days": [
                            1,
                            2,
                            3,
                            4,
                            5
                          ],
                          "startTime": 540,
                          "endTime": 1020,
                          "userId": 101
                        }
                      ],
                      "dateOverrides": [
                        {
                          "date": "2023-05-15",
                          "startTime": 600,
                          "endTime": 960,
                          "userId": 101
                        }
                      ],
                      "currentSeats": 4
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "User not found"
            }
          }
        }
      },
      "/booking-references": {
        "get": {
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "operationId": "listBookingReferences",
          "summary": "Find all booking references",
          "tags": [
            "booking-references"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No booking references were found"
            }
          }
        },
        "post": {
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "operationId": "addBookingReference",
          "summary": "Creates a new  booking reference",
          "requestBody": {
            "description": "Create a new booking reference related to one of your bookings",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "type",
                    "uid"
                  ],
                  "properties": {
                    "type": {
                      "type": "string"
                    },
                    "uid": {
                      "type": "string"
                    },
                    "meetingId": {
                      "type": "string"
                    },
                    "meetingPassword": {
                      "type": "string"
                    },
                    "meetingUrl": {
                      "type": "string"
                    },
                    "bookingId": {
                      "type": "boolean"
                    },
                    "externalCalendarId": {
                      "type": "string"
                    },
                    "deleted": {
                      "type": "boolean"
                    },
                    "credentialId": {
                      "type": "integer"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "booking-references"
          ],
          "responses": {
            "201": {
              "description": "OK,  booking reference created"
            },
            "400": {
              "description": "Bad request. BookingReference body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/booking-references/{id}": {
        "delete": {
          "operationId": "removeBookingReferenceById",
          "summary": "Remove an existing booking reference",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the booking reference to delete"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "booking-references"
          ],
          "responses": {
            "201": {
              "description": "OK, bookingReference removed successfully"
            },
            "400": {
              "description": "Bad request. BookingReference id is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        },
        "get": {
          "operationId": "getBookingReferenceById",
          "summary": "Find a booking reference",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the booking reference to get"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "booking-references"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "BookingReference was not found"
            }
          }
        },
        "patch": {
          "operationId": "editBookingReferenceById",
          "summary": "Edit an existing booking reference",
          "requestBody": {
            "description": "Edit an existing booking reference related to one of your bookings",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string"
                    },
                    "meetingId": {
                      "type": "string"
                    },
                    "meetingPassword": {
                      "type": "string"
                    },
                    "externalCalendarId": {
                      "type": "string"
                    },
                    "deleted": {
                      "type": "boolean"
                    },
                    "credentialId": {
                      "type": "integer"
                    }
                  }
                }
              }
            }
          },
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            },
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the booking reference to edit"
            }
          ],
          "tags": [
            "booking-references"
          ],
          "responses": {
            "201": {
              "description": "OK, BookingReference edited successfully"
            },
            "400": {
              "description": "Bad request. BookingReference body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/bookings": {
        "get": {
          "summary": "Find all bookings",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key",
              "example": "123456789abcdefgh"
            },
            {
              "in": "query",
              "name": "userId",
              "required": false,
              "schema": {
                "oneOf": [
                  {
                    "type": "integer",
                    "example": 1
                  },
                  {
                    "type": "array",
                    "items": {
                      "type": "integer"
                    },
                    "example": [
                      2,
                      3,
                      4
                    ]
                  }
                ]
              }
            },
            {
              "in": "query",
              "name": "take",
              "required": false,
              "schema": {
                "type": "number",
              }
            },
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "type": "number",
              }
            },            
            {
              "in": "query",
              "name": "attendeeEmail",
              "required": false,
              "schema": {
                "oneOf": [
                  {
                    "type": "string",
                    "format": "email",
                    "example": "john.doe@example.com"
                  },
                  {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "format": "email"
                    },
                    "example": [
                      "john.doe@example.com",
                      "jane.doe@example.com"
                    ]
                  }
                ]
              }
            }
          ],
          "operationId": "listBookings",
          "tags": [
            "bookings"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArrayOfBookings"
                  },
                  "examples": {
                    "bookings": {
                      "value": [
                        {
                          "booking": {
                            "id": 91,
                            "userId": 5,
                            "description": "",
                            "eventTypeId": 7,
                            "uid": "bFJeNb2uX8ANpT3JL5EfXw",
                            "title": "60min between Pro Example and John Doe",
                            "startTime": "2023-05-25T09:30:00.000Z",
                            "endTime": "2023-05-25T10:30:00.000Z",
                            "attendees": [
                              {
                                "email": "john.doe@example.com",
                                "name": "John Doe",
                                "timeZone": "Asia/Kolkata",
                                "locale": "en"
                              }
                            ],
                            "user": {
                              "email": "pro@example.com",
                              "name": "Pro Example",
                              "timeZone": "Asia/Kolkata",
                              "locale": "en"
                            },
                            "payment": [
                              {
                                "id": 1,
                                "success": true,
                                "paymentOption": "ON_BOOKING"
                              }
                            ],
                            "metadata": {},
                            "status": "ACCEPTED",
                            "responses": {
                              "email": "john.doe@example.com",
                              "name": "John Doe",
                              "location": {
                                "optionValue": "",
                                "value": "inPerson"
                              }
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No bookings were found"
            }
          }
        },
        "post": {
          "summary": "Creates a new booking",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "operationId": "addBooking",
          "requestBody": {
            "description": "Create a new booking related to one of your event-types",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "eventTypeId",
                    "start",
                    "responses",
                    "timeZone",
                    "language",
                    "metadata"
                  ],
                  "properties": {
                    "eventTypeId": {
                      "type": "integer",
                      "description": "ID of the event type to book"
                    },
                    "start": {
                      "type": "string",
                      "format": "date-time",
                      "description": "Start time of the Event"
                    },
                    "end": {
                      "type": "string",
                      "format": "date-time",
                      "description": "End time of the Event"
                    },
                    "responses": {
                      "type": "object",
                      "required": [
                        "name",
                        "email",
                        "location"
                      ],
                      "properties": {
                        "name": {
                          "type": "string",
                          "description": "Attendee full name"
                        },
                        "email": {
                          "type": "string",
                          "format": "email",
                          "description": "Attendee email address"
                        },
                        "location": {
                          "type": "object",
                          "properties": {
                            "optionValue": {
                              "type": "string",
                              "description": "Option value for the location"
                            },
                            "value": {
                              "type": "string",
                              "description": "The meeting URL, Phone number or Address"
                            }
                          },
                          "description": "Meeting location"
                        }
                      }
                    },
                    "metadata": {
                      "type": "object",
                      "properties": {},
                      "description": "Any metadata associated with the booking"
                    },
                    "timeZone": {
                      "type": "string",
                      "description": "TimeZone of the Attendee"
                    },
                    "language": {
                      "type": "string",
                      "description": "Language of the Attendee"
                    },
                    "title": {
                      "type": "string",
                      "description": "Booking event title"
                    },
                    "recurringEventId": {
                      "type": "integer",
                      "description": "Recurring event ID if the event is recurring"
                    },
                    "description": {
                      "type": "string",
                      "description": "Event description"
                    },
                    "status": {
                      "type": "string",
                      "description": "Acceptable values one of [\"ACCEPTED\", \"PENDING\", \"CANCELLED\", \"REJECTED\"]"
                    },
                    "seatsPerTimeSlot": {
                      "type": "integer",
                      "description": "The number of seats for each time slot"
                    },
                    "seatsShowAttendees": {
                      "type": "boolean",
                      "description": "Share Attendee information in seats"
                    },
                    "seatsShowAvailabilityCount": {
                      "type": "boolean",
                      "description": "Show the number of available seats"
                    },
                    "smsReminderNumber": {
                      "type": "number",
                      "description": "SMS reminder number"
                    }
                  }
                },
                "examples": {
                  "New Booking example": {
                        "eventTypeId": 12345,
                        "start": "2024-05-30T12:00:00.000Z",
                        "responses": {
                            "name": "John Doe",
                            "email": "johndoe@example.com",
                            "guests": [],
                            "location": {
                                "value": "inPerson",
                                "optionValue": ""
                            }
                        },
                        "metadata": {},
                        "timeZone": "Europe/London",
                        "language": "en",
                        "title": "Debugging between Syed Ali Shahbaz and Hello Hello",
                        "description": null,
                        "status": "PENDING",
                        "smsReminderNumber": null
                    }
                }
              }
            }
          },
          "tags": [
            "bookings"
          ],
          "responses": {
            "200": {
              "description": "Booking(s) created successfully.",
              "content": {
                "application/json": {
                  "examples": {
                    "booking created successfully example": {
                      "value": {
                        "booking": {
                          "id": 91,
                          "userId": 5,
                          "description": "",
                          "eventTypeId": 7,
                          "uid": "bFJeNb2uX8ANpT3JL5EfXw",
                          "title": "60min between Pro Example and John Doe",
                          "startTime": "2023-05-25T09:30:00.000Z",
                          "endTime": "2023-05-25T10:30:00.000Z",
                          "attendees": [
                            {
                              "email": "john.doe@example.com",
                              "name": "John Doe",
                              "timeZone": "Asia/Kolkata",
                              "locale": "en"
                            }
                          ],
                          "user": {
                            "email": "pro@example.com",
                            "name": "Pro Example",
                            "timeZone": "Asia/Kolkata",
                            "locale": "en"
                          },
                          "payment": [
                            {
                              "id": 1,
                              "success": true,
                              "paymentOption": "ON_BOOKING"
                            }
                          ],
                          "metadata": {},
                          "status": "ACCEPTED",
                          "responses": {
                            "email": "john.doe@example.com",
                            "name": "John Doe",
                            "location": {
                              "optionValue": "",
                              "value": "inPerson"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad request\n<table>\n  <tr>\n    <td>Message</td>\n    <td>Cause</td>\n  </tr>\n  <tr>\n    <td>Booking body is invalid</td>\n    <td>Missing property on booking entity.</td>\n  </tr>\n  <tr>\n    <td>Invalid eventTypeId</td>\n    <td>The provided eventTypeId does not exist.</td>\n  </tr>\n  <tr>\n    <td>Missing recurringCount</td>\n    <td>The eventType is recurring, and no recurringCount was passed.</td>\n  </tr>\n  <tr>\n    <td>Invalid recurringCount</td>\n    <td>The provided recurringCount is greater than the eventType recurring config</td>\n  </tr>\n</table>\n"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/bookings/{id}/cancel": {
        "delete": {
          "summary": "Booking cancellation",
          "operationId": "cancelBookingById",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the booking to cancel"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            },
            {
              "in": "query",
              "name": "allRemainingBookings",
              "required": false,
              "schema": {
                "type": "boolean"
              },
              "description": "Delete all remaining bookings"
            },
            {
              "in": "query",
              "name": "cancellationReason",
              "required": false,
              "schema": {
                "type": "string"
              },
              "description": "The reason for cancellation of the booking"
            }
          ],
          "tags": [
            "bookings"
          ],
          "responses": {
            "200": {
              "description": "OK, booking cancelled successfully"
            },
            "400": {
              "description": "Bad request\n <table>\n   <tr>\n     <td>Message</td>\n     <td>Cause</td>\n   </tr>\n   <tr>\n     <td>Booking not found</td>\n     <td>The provided id didn't correspond to any existing booking.</td>\n   </tr>\n   <tr>\n     <td>User not found</td>\n     <td>The userId did not matched an existing user.</td>\n   </tr>\n </table>\n"
            },
            "404": {
              "description": "User not found"
            }
          }
        }
      },
      "/bookings/{id}": {
        "get": {
          "summary": "Find a booking",
          "operationId": "getBookingById",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the booking to get"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "bookings"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Booking"
                  },
                  "examples": {
                    "booking": {
                      "value": {
                        "booking": {
                          "id": 91,
                          "userId": 5,
                          "description": "",
                          "eventTypeId": 7,
                          "uid": "bFJeNb2uX8ANpT3JL5EfXw",
                          "title": "60min between Pro Example and John Doe",
                          "startTime": "2023-05-25T09:30:00.000Z",
                          "endTime": "2023-05-25T10:30:00.000Z",
                          "attendees": [
                            {
                              "email": "john.doe@example.com",
                              "name": "John Doe",
                              "timeZone": "Asia/Kolkata",
                              "locale": "en"
                            }
                          ],
                          "user": {
                            "email": "pro@example.com",
                            "name": "Pro Example",
                            "timeZone": "Asia/Kolkata",
                            "locale": "en"
                          },
                          "payment": [
                            {
                              "id": 1,
                              "success": true,
                              "paymentOption": "ON_BOOKING"
                            }
                          ],
                          "metadata": {},
                          "status": "ACCEPTED",
                          "responses": {
                            "email": "john.doe@example.com",
                            "name": "John Doe",
                            "location": {
                              "optionValue": "",
                              "value": "inPerson"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "Booking was not found"
            }
          }
        },
        "patch": {
          "summary": "Edit an existing booking",
          "operationId": "editBookingById",
          "requestBody": {
            "description": "Edit an existing booking related to one of your event-types",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "description": "Booking event title"
                    },
                    "start": {
                      "type": "string",
                      "format": "date-time",
                      "description": "Start time of the Event"
                    },
                    "end": {
                      "type": "string",
                      "format": "date-time",
                      "description": "End time of the Event"
                    },
                    "status": {
                      "type": "string",
                      "description": "Acceptable values one of [\"ACCEPTED\", \"PENDING\", \"CANCELLED\", \"REJECTED\"]"
                    },
                    "description": {
                      "type": "string",
                      "description": "Description of the meeting"
                    }
                  }
                },
                "examples": {
                  "editBooking": {
                    "value": {
                      "title": "Debugging between Syed Ali Shahbaz and Hello Hello",
                      "start": "2023-05-24T13:00:00.000Z",
                      "end": "2023-05-24T13:30:00.000Z",
                      "status": "CANCELLED"
                    }
                  }
                }
              }
            }
          },
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            },
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the booking to edit"
            }
          ],
          "tags": [
            "bookings"
          ],
          "responses": {
            "200": {
              "description": "OK, booking edited successfully",
              "content": {
                "application/json": {
                  "examples": {
                    "bookings": {
                      "value": {
                        "booking": {
                          "id": 11223344,
                          "userId": 182,
                          "description": null,
                          "eventTypeId": 2323232,
                          "uid": "stoSJtnh83PEL4rZmqdHe2",
                          "title": "Debugging between Syed Ali Shahbaz and Hello Hello",
                          "startTime": "2023-05-24T13:00:00.000Z",
                          "endTime": "2023-05-24T13:30:00.000Z",
                          "metadata": {},
                          "status": "CANCELLED",
                          "responses": {
                            "email": "john.doe@example.com",
                            "name": "John Doe",
                            "location": {
                              "optionValue": "",
                              "value": "inPerson"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad request. Booking body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/credential-sync": {
        "delete": {
          "operationId": "deleteUserAppCredential",
          "summary": "Delete a credential record for a user",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            },
            {
              "in": "query",
              "name": "userId",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "ID of the user to fetch the credentials for"
            },
            {
              "in": "query",
              "name": "credentialId",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "ID of the credential to update"
            }
          ],
          "tags": [
            "credentials"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "505": {
              "description": "Credential syncing not enabled"
            }
          }
        },
        "get": {
          "operationId": "getUserAppCredentials",
          "summary": "Get all app credentials for a user",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            },
            {
              "in": "query",
              "name": "userId",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "ID of the user to fetch the credentials for"
            }
          ],
          "tags": [
            "credentials"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "505": {
              "description": "Credential syncing not enabled"
            }
          }
        },
        "patch": {
          "operationId": "updateUserAppCredential",
          "summary": "Update a credential record for a user",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            },
            {
              "in": "query",
              "name": "userId",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "ID of the user to fetch the credentials for"
            },
            {
              "in": "query",
              "name": "credentialId",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "ID of the credential to update"
            }
          ],
          "tags": [
            "credentials"
          ],
          "requestBody": {
            "description": "Update a new credential",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "encryptedKey"
                  ],
                  "properties": {
                    "encryptedKey": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "505": {
              "description": "Credential syncing not enabled"
            }
          }
        },
        "post": {
          "operationId": "createUserAppCredential",
          "summary": "Create a credential record for a user",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            },
            {
              "in": "query",
              "name": "userId",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "ID of the user to fetch the credentials for"
            }
          ],
          "tags": [
            "credentials"
          ],
          "requestBody": {
            "description": "Create a new credential",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "encryptedKey",
                    "appSlug"
                  ],
                  "properties": {
                    "encryptedKey": {
                      "type": "string"
                    },
                    "appSlug": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "505": {
              "description": "Credential syncing not enabled"
            }
          }
        }
      },
      "/custom-inputs": {
        "get": {
          "summary": "Find all eventTypeCustomInputs",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "custom-inputs"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No eventTypeCustomInputs were found"
            }
          }
        },
        "post": {
          "summary": "Creates a new eventTypeCustomInput",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "requestBody": {
            "description": "Create a new custom input for an event type",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "eventTypeId",
                    "label",
                    "type",
                    "required",
                    "placeholder"
                  ],
                  "properties": {
                    "eventTypeId": {
                      "type": "integer",
                      "description": "ID of the event type to which the custom input is being added"
                    },
                    "label": {
                      "type": "string",
                      "description": "Label of the custom input"
                    },
                    "type": {
                      "type": "string",
                      "description": "Type of the custom input. The value is ENUM; one of [TEXT, TEXTLONG, NUMBER, BOOL, RADIO, PHONE]"
                    },
                    "options": {
                      "type": "object",
                      "properties": {
                        "label": {
                          "type": "string"
                        },
                        "type": {
                          "type": "string"
                        }
                      },
                      "description": "Options for the custom input"
                    },
                    "required": {
                      "type": "boolean",
                      "description": "If the custom input is required before booking"
                    },
                    "placeholder": {
                      "type": "string",
                      "description": "Placeholder text for the custom input"
                    }
                  }
                },
                "examples": {
                  "custom-inputs": {
                    "summary": "An example of custom-inputs",
                    "value": {
                      "eventTypeID": 1,
                      "label": "Phone Number",
                      "type": "PHONE",
                      "required": true,
                      "placeholder": "100 101 1234"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "custom-inputs"
          ],
          "responses": {
            "201": {
              "description": "OK, eventTypeCustomInput created"
            },
            "400": {
              "description": "Bad request. EventTypeCustomInput body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/custom-inputs/{id}": {
        "delete": {
          "summary": "Remove an existing eventTypeCustomInput",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the eventTypeCustomInput to delete"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "custom-inputs"
          ],
          "responses": {
            "201": {
              "description": "OK, eventTypeCustomInput removed successfully"
            },
            "400": {
              "description": "Bad request. EventType id is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        },
        "get": {
          "summary": "Find a eventTypeCustomInput",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the eventTypeCustomInput to get"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "custom-inputs"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "EventType was not found"
            }
          }
        },
        "patch": {
          "summary": "Edit an existing eventTypeCustomInput",
          "requestBody": {
            "description": "Edit an existing eventTypeCustomInput for an event type",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "eventTypeId": {
                      "type": "integer",
                      "description": "ID of the event type to which the custom input is being added"
                    },
                    "label": {
                      "type": "string",
                      "description": "Label of the custom input"
                    },
                    "type": {
                      "type": "string",
                      "description": "Type of the custom input. The value is ENUM; one of [TEXT, TEXTLONG, NUMBER, BOOL, RADIO, PHONE]"
                    },
                    "options": {
                      "type": "object",
                      "properties": {
                        "label": {
                          "type": "string"
                        },
                        "type": {
                          "type": "string"
                        }
                      },
                      "description": "Options for the custom input"
                    },
                    "required": {
                      "type": "boolean",
                      "description": "If the custom input is required before booking"
                    },
                    "placeholder": {
                      "type": "string",
                      "description": "Placeholder text for the custom input"
                    }
                  }
                },
                "examples": {
                  "custom-inputs": {
                    "summary": "Example of patching an existing Custom Input",
                    "value": {
                      "required": true
                    }
                  }
                }
              }
            }
          },
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the eventTypeCustomInput to edit"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "custom-inputs"
          ],
          "responses": {
            "201": {
              "description": "OK, eventTypeCustomInput edited successfully"
            },
            "400": {
              "description": "Bad request. EventType body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/destination-calendars": {
        "get": {
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "summary": "Find all destination calendars",
          "tags": [
            "destination-calendars"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No destination calendars were found"
            }
          }
        },
        "post": {
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "summary": "Creates a new destination calendar",
          "requestBody": {
            "description": "Create a new destination calendar for your events",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "integration",
                    "externalId",
                    "credentialId"
                  ],
                  "properties": {
                    "integration": {
                      "type": "string",
                      "description": "The integration"
                    },
                    "externalId": {
                      "type": "string",
                      "description": "The external ID of the integration"
                    },
                    "eventTypeId": {
                      "type": "integer",
                      "description": "The ID of the eventType it is associated with"
                    },
                    "bookingId": {
                      "type": "integer",
                      "description": "The booking ID it is associated with"
                    },
                    "userId": {
                      "type": "integer",
                      "description": "The user it is associated with"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "destination-calendars"
          ],
          "responses": {
            "201": {
              "description": "OK, destination calendar created"
            },
            "400": {
              "description": "Bad request. DestinationCalendar body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/destination-calendars/{id}": {
        "delete": {
          "summary": "Remove an existing destination calendar",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the destination calendar to delete"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "destination-calendars"
          ],
          "responses": {
            "200": {
              "description": "OK, destinationCalendar removed successfully"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "Destination calendar not found"
            }
          }
        },
        "get": {
          "summary": "Find a destination calendar",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the destination calendar to get"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "destination-calendars"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "Destination calendar not found"
            }
          }
        },
        "patch": {
          "summary": "Edit an existing destination calendar",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the destination calendar to edit"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "requestBody": {
            "description": "Create a new booking related to one of your event-types",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "integration": {
                      "type": "string",
                      "description": "The integration"
                    },
                    "externalId": {
                      "type": "string",
                      "description": "The external ID of the integration"
                    },
                    "eventTypeId": {
                      "type": "integer",
                      "description": "The ID of the eventType it is associated with"
                    },
                    "bookingId": {
                      "type": "integer",
                      "description": "The booking ID it is associated with"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "destination-calendars"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "Destination calendar not found"
            }
          }
        }
      },
      "/event-types": {
        "get": {
          "summary": "Find all event types",
          "operationId": "listEventTypes",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            },
            {
              "in": "query",
              "name": "slug",
              "schema": {
                "type": "string"
              },
              "required": false,
              "description": "Slug to filter event types by"
            }
          ],
          "tags": [
            "event-types"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/event-types"
          },
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No event types were found"
            }
          }
        },
        "post": {
          "summary": "Creates a new event type",
          "operationId": "addEventType",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            }
          ],
          "requestBody": {
            "description": "Create a new event-type related to your user or team",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "title",
                    "slug",
                    "length",
                    "metadata"
                  ],
                  "properties": {
                    "length": {
                      "type": "integer",
                      "description": "Duration of the event type in minutes"
                    },
                    "metadata": {
                      "type": "object",
                      "description": "Metadata relating to event type. Pass {} if empty"
                    },
                    "title": {
                      "type": "string",
                      "description": "Title of the event type"
                    },
                    "slug": {
                      "type": "string",
                      "description": "Unique slug for the event type"
                    },
                    "hosts": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "userId": {
                            "type": "number"
                          },
                          "isFixed": {
                            "type": "boolean",
                            "description": "Host MUST be available for any slot to be bookable."
                          }
                        }
                      }
                    },
                    "hidden": {
                      "type": "boolean",
                      "description": "If the event type should be hidden from your public booking page"
                    },
                    "scheduleId": {
                      "type": "number",
                      "description": "The ID of the schedule for this event type"
                    },
                    "position": {
                      "type": "integer",
                      "description": "The position of the event type on the public booking page"
                    },
                    "teamId": {
                      "type": "integer",
                      "description": "Team ID if the event type should belong to a team"
                    },
                    "periodType": {
                      "type": "string",
                      "enum": [
                        "UNLIMITED",
                        "ROLLING",
                        "RANGE"
                      ],
                      "description": "To decide how far into the future an invitee can book an event with you"
                    },
                    "periodStartDate": {
                      "type": "string",
                      "format": "date-time",
                      "description": "Start date of bookable period (Required if periodType is 'range')"
                    },
                    "periodEndDate": {
                      "type": "string",
                      "format": "date-time",
                      "description": "End date of bookable period (Required if periodType is 'range')"
                    },
                    "periodDays": {
                      "type": "integer",
                      "description": "Number of bookable days (Required if periodType is rolling)"
                    },
                    "periodCountCalendarDays": {
                      "type": "boolean",
                      "description": "If calendar days should be counted for period days"
                    },
                    "requiresConfirmation": {
                      "type": "boolean",
                      "description": "If the event type should require your confirmation before completing the booking"
                    },
                    "recurringEvent": {
                      "type": "object",
                      "description": "If the event should recur every week/month/year with the selected frequency",
                      "properties": {
                        "interval": {
                          "type": "integer"
                        },
                        "count": {
                          "type": "integer"
                        },
                        "freq": {
                          "type": "integer"
                        }
                      }
                    },
                    "disableGuests": {
                      "type": "boolean",
                      "description": "If the event type should disable adding guests to the booking"
                    },
                    "hideCalendarNotes": {
                      "type": "boolean",
                      "description": "If the calendar notes should be hidden from the booking"
                    },
                    "minimumBookingNotice": {
                      "type": "integer",
                      "description": "Minimum time in minutes before the event is bookable"
                    },
                    "beforeEventBuffer": {
                      "type": "integer",
                      "description": "Number of minutes of buffer time before a Cal Event"
                    },
                    "afterEventBuffer": {
                      "type": "integer",
                      "description": "Number of minutes of buffer time after a Cal Event"
                    },
                    "schedulingType": {
                      "type": "string",
                      "description": "The type of scheduling if a Team event. Required for team events only",
                      "enum": [
                        "ROUND_ROBIN",
                        "COLLECTIVE",
                        "MANAGED"
                      ]
                    },
                    "price": {
                      "type": "integer",
                      "description": "Price of the event type booking"
                    },
                    "parentId": {
                      "type": "integer",
                      "description": "EventTypeId of the parent managed event"
                    },
                    "currency": {
                      "type": "string",
                      "description": "Currency acronym. Eg- usd, eur, gbp, etc."
                    },
                    "slotInterval": {
                      "type": "integer",
                      "description": "The intervals of available bookable slots in minutes"
                    },
                    "successRedirectUrl": {
                      "type": "string",
                      "format": "url",
                      "description": "A valid URL where the booker will redirect to, once the booking is completed successfully"
                    },
                    "description": {
                      "type": "string",
                      "description": "Description of the event type"
                    },
                    "locations": {
                      "type": "array",
                      "description": "A list of all available locations for the event type",
                      "items": {
                        "type": "array",
                        "items": {
                          "oneOf": [
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "enum": [
                                    "integrations:daily"
                                  ]
                                }
                              }
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "enum": [
                                    "attendeeInPerson"
                                  ]
                                }
                              }
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "enum": [
                                    "inPerson"
                                  ]
                                },
                                "address": {
                                  "type": "string"
                                },
                                "displayLocationPublicly": {
                                  "type": "boolean"
                                }
                              }
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "enum": [
                                    "link"
                                  ]
                                },
                                "link": {
                                  "type": "string"
                                },
                                "displayLocationPublicly": {
                                  "type": "boolean"
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                },
                "examples": {
                  "event-type": {
                    "summary": "An example of an individual event type POST request",
                    "value": {
                      "title": "Hello World",
                      "slug": "hello-world",
                      "length": 30,
                      "hidden": false,
                      "position": 0,
                      "eventName": null,
                      "timeZone": null,
                      "scheduleId": 5,
                      "periodType": "UNLIMITED",
                      "periodStartDate": "2023-02-15T08:46:16.000Z",
                      "periodEndDate": "2023-0-15T08:46:16.000Z",
                      "periodDays": null,
                      "periodCountCalendarDays": false,
                      "requiresConfirmation": false,
                      "recurringEvent": null,
                      "disableGuests": false,
                      "hideCalendarNotes": false,
                      "minimumBookingNotice": 120,
                      "beforeEventBuffer": 0,
                      "afterEventBuffer": 0,
                      "price": 0,
                      "currency": "usd",
                      "slotInterval": null,
                      "successRedirectUrl": null,
                      "description": "A test event type",
                      "metadata": {
                        "apps": {
                          "stripe": {
                            "price": 0,
                            "enabled": false,
                            "currency": "usd"
                          }
                        }
                      }
                    }
                  },
                  "team-event-type": {
                    "summary": "An example of a team event type POST request",
                    "value": {
                      "title": "Tennis class",
                      "slug": "tennis-class-{{$guid}}",
                      "length": 60,
                      "hidden": false,
                      "position": 0,
                      "teamId": 3,
                      "eventName": null,
                      "timeZone": null,
                      "periodType": "UNLIMITED",
                      "periodStartDate": null,
                      "periodEndDate": null,
                      "periodDays": null,
                      "periodCountCalendarDays": null,
                      "requiresConfirmation": true,
                      "recurringEvent": {
                        "interval": 2,
                        "count": 10,
                        "freq": 2
                      },
                      "disableGuests": false,
                      "hideCalendarNotes": false,
                      "minimumBookingNotice": 120,
                      "beforeEventBuffer": 0,
                      "afterEventBuffer": 0,
                      "schedulingType": "COLLECTIVE",
                      "price": 0,
                      "currency": "usd",
                      "slotInterval": null,
                      "successRedirectUrl": null,
                      "description": null,
                      "locations": [
                        {
                          "address": "London",
                          "type": "inPerson"
                        }
                      ],
                      "metadata": {}
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "event-types"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/event-types"
          },
          "responses": {
            "201": {
              "description": "OK, event type created"
            },
            "400": {
              "description": "Bad request. EventType body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/event-types/{id}": {
        "delete": {
          "operationId": "removeEventTypeById",
          "summary": "Remove an existing eventType",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            },
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the eventType to delete"
            }
          ],
          "tags": [
            "event-types"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/event-types"
          },
          "responses": {
            "201": {
              "description": "OK, eventType removed successfully"
            },
            "400": {
              "description": "Bad request. EventType id is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        },
        "get": {
          "operationId": "getEventTypeById",
          "summary": "Find a eventType",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            },
            {
              "in": "path",
              "name": "id",
              "example": 4,
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the eventType to get"
            }
          ],
          "tags": [
            "event-types"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/event-types"
          },
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "EventType was not found"
            }
          }
        },
        "patch": {
          "operationId": "editEventTypeById",
          "summary": "Edit an existing eventType",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            },
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the eventType to edit"
            }
          ],
          "requestBody": {
            "description": "Create a new event-type related to your user or team",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "length": {
                      "type": "integer",
                      "description": "Duration of the event type in minutes"
                    },
                    "metadata": {
                      "type": "object",
                      "description": "Metadata relating to event type. Pass {} if empty"
                    },
                    "title": {
                      "type": "string",
                      "description": "Title of the event type"
                    },
                    "slug": {
                      "type": "string",
                      "description": "Unique slug for the event type"
                    },
                    "scheduleId": {
                      "type": "number",
                      "description": "The ID of the schedule for this event type"
                    },
                    "hosts": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "userId": {
                            "type": "number"
                          },
                          "isFixed": {
                            "type": "boolean",
                            "description": "Host MUST be available for any slot to be bookable."
                          }
                        }
                      }
                    },
                    "hidden": {
                      "type": "boolean",
                      "description": "If the event type should be hidden from your public booking page"
                    },
                    "position": {
                      "type": "integer",
                      "description": "The position of the event type on the public booking page"
                    },
                    "teamId": {
                      "type": "integer",
                      "description": "Team ID if the event type should belong to a team"
                    },
                    "periodType": {
                      "type": "string",
                      "enum": [
                        "UNLIMITED",
                        "ROLLING",
                        "RANGE"
                      ],
                      "description": "To decide how far into the future an invitee can book an event with you"
                    },
                    "periodStartDate": {
                      "type": "string",
                      "format": "date-time",
                      "description": "Start date of bookable period (Required if periodType is 'range')"
                    },
                    "periodEndDate": {
                      "type": "string",
                      "format": "date-time",
                      "description": "End date of bookable period (Required if periodType is 'range')"
                    },
                    "periodDays": {
                      "type": "integer",
                      "description": "Number of bookable days (Required if periodType is rolling)"
                    },
                    "periodCountCalendarDays": {
                      "type": "boolean",
                      "description": "If calendar days should be counted for period days"
                    },
                    "requiresConfirmation": {
                      "type": "boolean",
                      "description": "If the event type should require your confirmation before completing the booking"
                    },
                    "recurringEvent": {
                      "type": "object",
                      "description": "If the event should recur every week/month/year with the selected frequency",
                      "properties": {
                        "interval": {
                          "type": "integer"
                        },
                        "count": {
                          "type": "integer"
                        },
                        "freq": {
                          "type": "integer"
                        }
                      }
                    },
                    "disableGuests": {
                      "type": "boolean",
                      "description": "If the event type should disable adding guests to the booking"
                    },
                    "hideCalendarNotes": {
                      "type": "boolean",
                      "description": "If the calendar notes should be hidden from the booking"
                    },
                    "minimumBookingNotice": {
                      "type": "integer",
                      "description": "Minimum time in minutes before the event is bookable"
                    },
                    "beforeEventBuffer": {
                      "type": "integer",
                      "description": "Number of minutes of buffer time before a Cal Event"
                    },
                    "afterEventBuffer": {
                      "type": "integer",
                      "description": "Number of minutes of buffer time after a Cal Event"
                    },
                    "schedulingType": {
                      "type": "string",
                      "description": "The type of scheduling if a Team event. Required for team events only",
                      "enum": [
                        "ROUND_ROBIN",
                        "COLLECTIVE"
                      ]
                    },
                    "price": {
                      "type": "integer",
                      "description": "Price of the event type booking"
                    },
                    "currency": {
                      "type": "string",
                      "description": "Currency acronym. Eg- usd, eur, gbp, etc."
                    },
                    "slotInterval": {
                      "type": "integer",
                      "description": "The intervals of available bookable slots in minutes"
                    },
                    "successRedirectUrl": {
                      "type": "string",
                      "format": "url",
                      "description": "A valid URL where the booker will redirect to, once the booking is completed successfully"
                    },
                    "description": {
                      "type": "string",
                      "description": "Description of the event type"
                    },
                    "seatsPerTimeSlot": {
                      "type": "integer",
                      "description": "The number of seats for each time slot"
                    },
                    "seatsShowAttendees": {
                      "type": "boolean",
                      "description": "Share Attendee information in seats"
                    },
                    "seatsShowAvailabilityCount": {
                      "type": "boolean",
                      "description": "Show the number of available seats"
                    },
                    "locations": {
                      "type": "array",
                      "description": "A list of all available locations for the event type",
                      "items": {
                        "type": "array",
                        "items": {
                          "oneOf": [
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "enum": [
                                    "integrations:daily"
                                  ]
                                }
                              }
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "enum": [
                                    "attendeeInPerson"
                                  ]
                                }
                              }
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "enum": [
                                    "inPerson"
                                  ]
                                },
                                "address": {
                                  "type": "string"
                                },
                                "displayLocationPublicly": {
                                  "type": "boolean"
                                }
                              }
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "enum": [
                                    "link"
                                  ]
                                },
                                "link": {
                                  "type": "string"
                                },
                                "displayLocationPublicly": {
                                  "type": "boolean"
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                },
                "example": {
                  "event-type": {
                    "summary": "An example of event type PATCH request",
                    "value": {
                      "length": 60,
                      "requiresConfirmation": true
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "event-types"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/event-types"
          },
          "responses": {
            "201": {
              "description": "OK, eventType edited successfully"
            },
            "400": {
              "description": "Bad request. EventType body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/me": {
        "get": {
          "summary": "Get my information",
          "tags": [
            "me"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "example": {
                      "user": {
                        "id": 1234,
                        "username": "johndoe",
                        "name": "John Doe",
                        "email": "john.doe@test.com",
                        "emailVerified": "2023-06-08T13:44:24.095Z",
                        "bio": "Example bio",
                        "avatar": "",
                        "timeZone": "Asia/Dubai",
                        "weekStart": "Monday",
                        "endTime": 960,
                        "bufferTime": 0,
                        "appTheme": null,
                        "theme": "",
                        "defaultScheduleId": 112233,
                        "locale": "en",
                        "timeFormat": 12,
                        "hideBranding": true,
                        "brandColor": "#bf6d6f",
                        "darkBrandColor": "#fafafa",
                        "allowDynamicBooking": true,
                        "away": false,
                        "createdDate": "2021-08-23T06:44:53.393Z",
                        "verified": true,
                        "invitedTo": null,
                        "role": "ADMIN"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/memberships": {
        "get": {
          "summary": "Find all memberships",
          "tags": [
            "memberships"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No memberships were found"
            }
          }
        },
        "post": {
          "summary": "Creates a new membership",
          "tags": [
            "memberships"
          ],
          "responses": {
            "201": {
              "description": "OK, membership created"
            },
            "400": {
              "description": "Bad request. Membership body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/memberships/{userId}_{teamId}": {
        "delete": {
          "summary": "Remove an existing membership",
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "Numeric userId of the membership to get"
            },
            {
              "in": "path",
              "name": "teamId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "Numeric teamId of the membership to get"
            }
          ],
          "tags": [
            "memberships"
          ],
          "responses": {
            "201": {
              "description": "OK, membership removed successfuly"
            },
            "400": {
              "description": "Bad request. Membership id is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        },
        "get": {
          "summary": "Find a membership by userID and teamID",
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "Numeric userId of the membership to get"
            },
            {
              "in": "path",
              "name": "teamId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "Numeric teamId of the membership to get"
            }
          ],
          "tags": [
            "memberships"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "Membership was not found"
            }
          }
        },
        "patch": {
          "summary": "Edit an existing membership",
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "Numeric userId of the membership to get"
            },
            {
              "in": "path",
              "name": "teamId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "Numeric teamId of the membership to get"
            }
          ],
          "tags": [
            "memberships"
          ],
          "responses": {
            "201": {
              "description": "OK, membership edited successfully"
            },
            "400": {
              "description": "Bad request. Membership body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/payments/{id}": {
        "get": {
          "summary": "Find a payment",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            },
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the payment to get"
            }
          ],
          "tags": [
            "payments"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "Payment was not found"
            }
          }
        }
      },
      "/payments": {
        "get": {
          "summary": "Find all payments",
          "tags": [
            "payments"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No payments were found"
            }
          }
        }
      },
      "/schedules": {
        "get": {
          "operationId": "listSchedules",
          "summary": "Find all schedules",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            }
          ],
          "tags": [
            "schedules"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "examples": {
                    "schedules": {
                      "value": {
                        "schedules": [
                          {
                            "id": 1234,
                            "userId": 5678,
                            "name": "Sample Schedule 1",
                            "timeZone": "America/Chicago",
                            "availability": [
                              {
                                "id": 987,
                                "eventTypeId": null,
                                "days": [
                                  1,
                                  2,
                                  3,
                                  4,
                                  5
                                ],
                                "startTime": "09:00:00",
                                "endTime": "23:00:00"
                              }
                            ]
                          },
                          {
                            "id": 2345,
                            "userId": 6789,
                            "name": "Sample Schedule 2",
                            "timeZone": "Europe/Amsterdam",
                            "availability": [
                              {
                                "id": 876,
                                "eventTypeId": null,
                                "days": [
                                  1,
                                  2,
                                  3,
                                  4,
                                  5
                                ],
                                "startTime": "09:00:00",
                                "endTime": "17:00:00"
                              }
                            ]
                          }
                        ]
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No schedules were found"
            }
          }
        },
        "post": {
          "operationId": "addSchedule",
          "summary": "Creates a new schedule",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            }
          ],
          "requestBody": {
            "description": "Create a new schedule",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "name",
                    "timeZone"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "description": "Name of the schedule"
                    },
                    "timeZone": {
                      "type": "string",
                      "description": "The timeZone for this schedule"
                    }
                  }
                },
                "examples": {
                  "schedule": {
                    "value": {
                      "name": "Sample Schedule",
                      "timeZone": "Asia/Calcutta"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "schedules"
          ],
          "responses": {
            "200": {
              "description": "OK, schedule created",
              "content": {
                "application/json": {
                  "examples": {
                    "schedule": {
                      "value": {
                        "schedule": {
                          "id": 79471,
                          "userId": 182,
                          "name": "Total Testing",
                          "timeZone": "Asia/Calcutta",
                          "availability": [
                            {
                              "id": 337917,
                              "eventTypeId": null,
                              "days": [
                                1,
                                2,
                                3,
                                4,
                                5
                              ],
                              "startTime": "09:00:00",
                              "endTime": "17:00:00"
                            }
                          ]
                        },
                        "message": "Schedule created successfully"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad request. Schedule body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/schedules/{id}": {
        "delete": {
          "operationId": "removeScheduleById",
          "summary": "Remove an existing schedule",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the schedule to delete"
            },
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            }
          ],
          "tags": [
            "schedules"
          ],
          "responses": {
            "201": {
              "description": "OK, schedule removed successfully"
            },
            "400": {
              "description": "Bad request. Schedule id is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        },
        "get": {
          "operationId": "getScheduleById",
          "summary": "Find a schedule",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the schedule to get"
            },
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            }
          ],
          "tags": [
            "schedules"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "examples": {
                    "schedule": {
                      "value": {
                        "schedule": {
                          "id": 12345,
                          "userId": 182,
                          "name": "Sample Schedule",
                          "timeZone": "Asia/Calcutta",
                          "availability": [
                            {
                              "id": 111,
                              "eventTypeId": null,
                              "days": [
                                0,
                                1,
                                2,
                                3,
                                4,
                                6
                              ],
                              "startTime": "00:00:00",
                              "endTime": "23:45:00"
                            },
                            {
                              "id": 112,
                              "eventTypeId": null,
                              "days": [
                                5
                              ],
                              "startTime": "00:00:00",
                              "endTime": "12:00:00"
                            },
                            {
                              "id": 113,
                              "eventTypeId": null,
                              "days": [
                                5
                              ],
                              "startTime": "15:00:00",
                              "endTime": "23:45:00"
                            }
                          ]
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "Schedule was not found"
            }
          }
        },
        "patch": {
          "operationId": "editScheduleById",
          "summary": "Edit an existing schedule",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the schedule to edit"
            },
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            }
          ],
          "requestBody": {
            "description": "Edit an existing schedule",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "description": "Name of the schedule"
                    },
                    "timeZone": {
                      "type": "string",
                      "description": "The timezone for this schedule"
                    }
                  }
                },
                "examples": {
                  "schedule": {
                    "value": {
                      "name": "Updated Schedule",
                      "timeZone": "Asia/Calcutta"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "schedules"
          ],
          "responses": {
            "200": {
              "description": "OK, schedule edited successfully",
              "content": {
                "application/json": {
                  "examples": {
                    "schedule": {
                      "value": {
                        "schedule": {
                          "id": 12345,
                          "userId": 1,
                          "name": "Total Testing Part 2",
                          "timeZone": "Asia/Calcutta",
                          "availability": [
                            {
                              "id": 4567,
                              "eventTypeId": null,
                              "days": [
                                1,
                                2,
                                3,
                                4,
                                5
                              ],
                              "startTime": "09:00:00",
                              "endTime": "17:00:00"
                            }
                          ]
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad request. Schedule body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/selected-calendars": {
        "get": {
          "operationId": "listSelectedCalendars",
          "summary": "Find all selected calendars",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            }
          ],
          "tags": [
            "selected-calendars"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No selected calendars were found"
            }
          }
        },
        "post": {
          "summary": "Creates a new selected calendar",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            }
          ],
          "requestBody": {
            "description": "Create a new selected calendar",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "integration",
                    "externalId"
                  ],
                  "properties": {
                    "integration": {
                      "type": "string",
                      "description": "The integration name"
                    },
                    "externalId": {
                      "type": "string",
                      "description": "The external ID of the integration"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "selected-calendars"
          ],
          "responses": {
            "201": {
              "description": "OK, selected calendar created"
            },
            "400": {
              "description": "Bad request. SelectedCalendar body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/selected-calendars/{userId}_{integration}_{externalId}": {
        "delete": {
          "operationId": "removeSelectedCalendarById",
          "summary": "Remove a selected calendar",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            },
            {
              "in": "path",
              "name": "userId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "userId of the selected calendar to get"
            },
            {
              "in": "path",
              "name": "externalId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "externalId of the selected-calendar to get"
            },
            {
              "in": "path",
              "name": "integration",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "integration of the selected calendar to get"
            }
          ],
          "tags": [
            "selected-calendars"
          ],
          "responses": {
            "201": {
              "description": "OK, selected-calendar removed successfully"
            },
            "400": {
              "description": "Bad request. SelectedCalendar id is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        },
        "get": {
          "operationId": "getSelectedCalendarById",
          "summary": "Find a selected calendar by providing the compoundId(userId_integration_externalId) separated by `_`",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            },
            {
              "in": "path",
              "name": "userId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "userId of the selected calendar to get"
            },
            {
              "in": "path",
              "name": "externalId",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "externalId of the selected calendar to get"
            },
            {
              "in": "path",
              "name": "integration",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "integration of the selected calendar to get"
            }
          ],
          "tags": [
            "selected-calendars"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "SelectedCalendar was not found"
            }
          }
        },
        "patch": {
          "operationId": "editSelectedCalendarById",
          "summary": "Edit a selected calendar",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            },
            {
              "in": "path",
              "name": "userId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "userId of the selected calendar to get"
            },
            {
              "in": "path",
              "name": "externalId",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "externalId of the selected calendar to get"
            },
            {
              "in": "path",
              "name": "integration",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "integration of the selected calendar to get"
            }
          ],
          "tags": [
            "selected-calendars"
          ],
          "responses": {
            "201": {
              "description": "OK, selected-calendar edited successfully"
            },
            "400": {
              "description": "Bad request. SelectedCalendar body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/slots": {
        "get": {
          "summary": "Get all bookable slots between a datetime range",
          "tags": [
            "slots"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            },
            {
              "in": "query",
              "name": "eventTypeId",
              "schema": {
                "type": "number"
              },
              "required": false,
              "description": "The event type Id to fetch available slots against"
            },
            {
              "in": "query",
              "name": "startTime",
              "schema": {
                "type": "string",
                "format": "date-time"
              },
              "required": true,
              "description": "Start time of the slot lookup"
            },
            {
              "in": "query",
              "name": "endTime",
              "schema": {
                "type": "string",
                "format": "date-time"
              },
              "required": true,
              "description": "End time of the slot lookup"
            },
            {
              "in": "query",
              "name": "timeZone",
              "schema": {
                "type": "string"
              },
              "description": "TimeZone for the slot lookup"
            },
            {
              "in": "query",
              "name": "usernameList",
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "description": "An array of usernames [To be used when not using eventTypeId]"
            },
            {
              "in": "query",
              "name": "eventTypeSlug",
              "schema": {
                "type": "string"
              },
              "description": "Slug of the event type to fetch available slots against [To be used when not using eventTypeId]"
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "example": {
                      "slots": {
                        "2024-04-13": [
                          {
                            "time": "2024-04-13T11:00:00+04:00"
                          },
                          {
                            "time": "2024-04-13T12:00:00+04:00"
                          },
                          {
                            "time": "2024-04-13T13:00:00+04:00"
                          }
                        ]
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/teams": {
        "get": {
          "operationId": "listTeams",
          "summary": "Find all teams",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "teams"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No teams were found"
            }
          }
        },
        "post": {
          "operationId": "addTeam",
          "summary": "Creates a new team",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "requestBody": {
            "description": "Create a new custom input for an event type",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "name",
                    "slug",
                    "hideBookATeamMember",
                    "brandColor",
                    "darkBrandColor",
                    "timeZone",
                    "weekStart",
                    "isPrivate"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "description": "Name of the team"
                    },
                    "slug": {
                      "type": "string",
                      "description": "A unique slug that works as path for the team public page"
                    },
                    "hideBookATeamMember": {
                      "type": "boolean",
                      "description": "Flag to hide or show the book a team member option"
                    },
                    "brandColor": {
                      "type": "string",
                      "description": "Primary brand color for the team"
                    },
                    "darkBrandColor": {
                      "type": "string",
                      "description": "Dark variant of the primary brand color for the team"
                    },
                    "timeZone": {
                      "type": "string",
                      "description": "Time zone of the team"
                    },
                    "weekStart": {
                      "type": "string",
                      "description": "Starting day of the week for the team"
                    },
                    "isPrivate": {
                      "type": "boolean",
                      "description": "Flag indicating if the team is private"
                    },
                    "ownerId": {
                      "type": "number",
                      "description": "ID of the team owner - only admins can set this."
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "teams"
          ],
          "responses": {
            "201": {
              "description": "OK, team created"
            },
            "400": {
              "description": "Bad request. Team body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/teams/{teamId}": {
        "delete": {
          "operationId": "removeTeamById",
          "summary": "Remove an existing team",
          "parameters": [
            {
              "in": "path",
              "name": "teamId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the team to delete"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "teams"
          ],
          "responses": {
            "201": {
              "description": "OK, team removed successfully"
            },
            "400": {
              "description": "Bad request. Team id is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        },
        "get": {
          "operationId": "getTeamById",
          "summary": "Find a team",
          "parameters": [
            {
              "in": "path",
              "name": "teamId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the team to get"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "teams"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "Team was not found"
            }
          }
        },
        "patch": {
          "operationId": "editTeamById",
          "summary": "Edit an existing team",
          "parameters": [
            {
              "in": "path",
              "name": "teamId",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the team to edit"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "requestBody": {
            "description": "Create a new custom input for an event type",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "description": "Name of the team"
                    },
                    "slug": {
                      "type": "string",
                      "description": "A unique slug that works as path for the team public page"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "teams"
          ],
          "responses": {
            "201": {
              "description": "OK, team edited successfully"
            },
            "400": {
              "description": "Bad request. Team body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/teams/{teamId}/event-types": {
        "get": {
          "summary": "Find all event types that belong to teamId",
          "operationId": "listEventTypesByTeamId",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API Key"
            },
            {
              "in": "path",
              "name": "teamId",
              "schema": {
                "type": "number"
              },
              "required": true
            }
          ],
          "tags": [
            "event-types"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/event-types"
          },
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No event types were found"
            }
          }
        }
      },
      "/users": {
        "get": {
          "operationId": "listUsers",
          "summary": "Find all users.",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            },
            {
              "in": "query",
              "name": "email",
              "required": false,
              "schema": {
                "type": "array",
                "items": {
                  "type": "string",
                  "format": "email"
                }
              },
              "style": "form",
              "explode": true,
              "description": "The email address or an array of email addresses to filter by"
            }
          ],
          "tags": [
            "users"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No users were found"
            }
          }
        },
        "post": {
          "operationId": "addUser",
          "summary": "Creates a new user",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "requestBody": {
            "description": "Create a new user",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "email",
                    "username"
                  ],
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email",
                      "description": "Email that belongs to the user being edited"
                    },
                    "username": {
                      "type": "string",
                      "description": "Username for the user being created"
                    },
                    "brandColor": {
                      "description": "The new user's brand color",
                      "type": "string"
                    },
                    "darkBrandColor": {
                      "description": "The new user's brand color for dark mode",
                      "type": "string"
                    },
                    "hideBranding": {
                      "description": "Remove branding from the user's calendar page",
                      "type": "boolean"
                    },
                    "weekStart": {
                      "description": "Start of the week. Acceptable values are one of [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]",
                      "type": "string"
                    },
                    "timeZone": {
                      "description": "The new user's time zone. Eg- 'EUROPE/PARIS'",
                      "type": "string"
                    },
                    "theme": {
                      "description": "Default theme for the new user. Acceptable values are one of [DARK, LIGHT]",
                      "type": "string"
                    },
                    "timeFormat": {
                      "description": "The new user's time format. Acceptable values are one of [TWELVE, TWENTY_FOUR]",
                      "type": "string"
                    },
                    "locale": {
                      "description": "The new user's locale. Acceptable values are one of [EN, FR, IT, RU, ES, DE, PT, RO, NL, PT_BR, ES_419, KO, JA, PL, AR, IW, ZH_CH, ZH_TW, CS, SR, SV, VI]",
                      "type": "string"
                    },
                    "avatar": {
                      "description": "The user's avatar, in base64 format",
                      "type": "string"
                    }
                  }
                },
                "examples": {
                  "user": {
                    "summary": "An example of USER",
                    "value": {
                      "email": "email@example.com",
                      "username": "johndoe",
                      "weekStart": "MONDAY",
                      "brandColor": "#555555",
                      "darkBrandColor": "#111111",
                      "timeZone": "EUROPE/PARIS",
                      "theme": "LIGHT",
                      "timeFormat": "TWELVE",
                      "locale": "FR"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "users"
          ],
          "responses": {
            "201": {
              "description": "OK, user created"
            },
            "400": {
              "description": "Bad request. user body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/users/{userId}": {
        "delete": {
          "summary": "Remove an existing user",
          "operationId": "removeUserById",
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "example": 1,
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the user to delete"
            },
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API key"
            }
          ],
          "tags": [
            "users"
          ],
          "responses": {
            "201": {
              "description": "OK, user removed successfuly"
            },
            "400": {
              "description": "Bad request. User id is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        },
        "get": {
          "summary": "Find a user, returns your user if regular user.",
          "operationId": "getUserById",
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "example": 4,
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the user to get"
            },
            {
              "in": "query",
              "name": "apiKey",
              "schema": {
                "type": "string"
              },
              "required": true,
              "description": "Your API key"
            }
          ],
          "tags": [
            "users"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "User was not found"
            }
          }
        },
        "patch": {
          "summary": "Edit an existing user",
          "operationId": "editUserById",
          "parameters": [
            {
              "in": "path",
              "name": "userId",
              "example": 4,
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "ID of the user to edit"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "requestBody": {
            "description": "Edit an existing attendee related to one of your bookings",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email",
                      "description": "Email that belongs to the user being edited"
                    },
                    "username": {
                      "type": "string",
                      "description": "Username for the user being edited"
                    },
                    "brandColor": {
                      "description": "The user's brand color",
                      "type": "string"
                    },
                    "darkBrandColor": {
                      "description": "The user's brand color for dark mode",
                      "type": "string"
                    },
                    "weekStart": {
                      "description": "Start of the week. Acceptable values are one of [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY]",
                      "type": "string"
                    },
                    "timeZone": {
                      "description": "The user's time zone",
                      "type": "string"
                    },
                    "hideBranding": {
                      "description": "Remove branding from the user's calendar page",
                      "type": "boolean"
                    },
                    "theme": {
                      "description": "Default theme for the user. Acceptable values are one of [DARK, LIGHT]",
                      "type": "string"
                    },
                    "timeFormat": {
                      "description": "The user's time format. Acceptable values are one of [TWELVE, TWENTY_FOUR]",
                      "type": "string"
                    },
                    "locale": {
                      "description": "The user's locale. Acceptable values are one of [EN, FR, IT, RU, ES, DE, PT, RO, NL, PT_BR, ES_419, KO, JA, PL, AR, IW, ZH_CH, ZH_TW, CS, SR, SV, VI]",
                      "type": "string"
                    },
                    "avatar": {
                      "description": "The user's avatar, in base64 format",
                      "type": "string"
                    }
                  }
                },
                "examples": {
                  "user": {
                    "summary": "An example of USER",
                    "value": {
                      "email": "email@example.com",
                      "username": "johndoe",
                      "weekStart": "MONDAY",
                      "brandColor": null,
                      "darkBrandColor": null,
                      "timeZone": "EUROPE/PARIS",
                      "theme": "LIGHT",
                      "timeFormat": "TWELVE",
                      "locale": "FR"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "users"
          ],
          "responses": {
            "200": {
              "description": "OK, user edited successfully"
            },
            "400": {
              "description": "Bad request. User body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "403": {
              "description": "Insufficient permissions to access resource."
            }
          }
        }
      },
      "/webhooks": {
        "get": {
          "summary": "Find all webhooks",
          "operationId": "listWebhooks",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "webhooks"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/webhooks"
          },
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "No webhooks were found"
            }
          }
        },
        "post": {
          "summary": "Creates a new webhook",
          "operationId": "addWebhook",
          "parameters": [
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "requestBody": {
            "description": "Create a new webhook",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "subscriberUrl",
                    "eventTriggers",
                    "active"
                  ],
                  "properties": {
                    "subscriberUrl": {
                      "type": "string",
                      "format": "uri",
                      "description": "The URL to subscribe to this webhook"
                    },
                    "eventTriggers": {
                      "type": "string",
                      "enum": [
                        "BOOKING_CREATED",
                        "BOOKING_RESCHEDULED",
                        "BOOKING_CANCELLED",
                        "MEETING_ENDED"
                      ],
                      "description": "The events which should trigger this webhook call"
                    },
                    "active": {
                      "type": "boolean",
                      "description": "Whether the webhook is active and should trigger on associated trigger events"
                    },
                    "payloadTemplate": {
                      "type": "string",
                      "description": "The template of the webhook's payload"
                    },
                    "eventTypeId": {
                      "type": "number",
                      "description": "The event type ID if this webhook should be associated with only that event type"
                    },
                    "secret": {
                      "type": "string",
                      "description": "The secret to verify the authenticity of the received payload"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "webhooks"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/webhooks"
          },
          "responses": {
            "201": {
              "description": "OK, webhook created"
            },
            "400": {
              "description": "Bad request. webhook body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      },
      "/webhooks/{id}": {
        "delete": {
          "summary": "Remove an existing hook",
          "operationId": "removeWebhookById",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "Numeric ID of the hooks to delete"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "webhooks"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/webhooks"
          },
          "responses": {
            "201": {
              "description": "OK, hook removed successfully"
            },
            "400": {
              "description": "Bad request. hook id is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        },
        "get": {
          "summary": "Find a webhook",
          "operationId": "getWebhookById",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "Numeric ID of the webhook to get"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "tags": [
            "webhooks"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/webhooks"
          },
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            },
            "404": {
              "description": "Webhook was not found"
            }
          }
        },
        "patch": {
          "summary": "Edit an existing webhook",
          "operationId": "editWebhookById",
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "schema": {
                "type": "integer"
              },
              "required": true,
              "description": "Numeric ID of the webhook to edit"
            },
            {
              "in": "query",
              "name": "apiKey",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Your API key"
            }
          ],
          "requestBody": {
            "description": "Edit an existing webhook",
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "subscriberUrl": {
                      "type": "string",
                      "format": "uri",
                      "description": "The URL to subscribe to this webhook"
                    },
                    "eventTriggers": {
                      "type": "string",
                      "enum": [
                        "BOOKING_CREATED",
                        "BOOKING_RESCHEDULED",
                        "BOOKING_CANCELLED",
                        "MEETING_ENDED"
                      ],
                      "description": "The events which should trigger this webhook call"
                    },
                    "active": {
                      "type": "boolean",
                      "description": "Whether the webhook is active and should trigger on associated trigger events"
                    },
                    "payloadTemplate": {
                      "type": "string",
                      "description": "The template of the webhook's payload"
                    },
                    "eventTypeId": {
                      "type": "number",
                      "description": "The event type ID if this webhook should be associated with only that event type"
                    },
                    "secret": {
                      "type": "string",
                      "description": "The secret to verify the authenticity of the received payload"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "webhooks"
          ],
          "externalDocs": {
            "url": "https://docs.cal.com/core-features/webhooks"
          },
          "responses": {
            "201": {
              "description": "OK, webhook edited successfully"
            },
            "400": {
              "description": "Bad request. Webhook body is invalid."
            },
            "401": {
              "description": "Authorization information is missing or invalid."
            }
          }
        }
      }
    }
  }
