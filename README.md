```mermaid
erDiagram
User {
  Int id PK
  String nickname
  String email "UNIQUE"
  String encryptedPassword
  String type
  Datetime createdAt
}

Store {
  Int id PK
  String address
  String phoneNumber
  String imageURL
  String detail
  Datetime createdAt
}

Product{
 Int id PK
 String imageURL
 String price
 String category
 String size
 String quantity
 String description
 String discountPrice
 Datetime createdAt
}

Store ||--o{ User : ""


```
