# API Documentation - FrensChain

Documentation complète de l'API REST de FrensChain.

## Base URL

```
http://localhost:3001/api
```

## Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête :

```
Authorization: Bearer <token>
```

## Endpoints

### Authentification

#### POST /auth/login
Connexion avec wallet Solana.

**Body:**
```json
{
  "walletAddress": "string",
  "signature": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "walletAddress": "string",
    "username": "string",
    "isPremium": boolean,
    "profileImage": "string"
  }
}
```

#### POST /auth/register
Création d'un nouveau profil utilisateur.

**Body:**
```json
{
  "walletAddress": "string",
  "username": "string",
  "interests": ["string"],
  "signature": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "walletAddress": "string",
    "username": "string",
    "isPremium": boolean,
    "profileImage": "string",
    "interests": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  }
}
```

#### GET /auth/me
Récupérer les informations de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "string",
  "walletAddress": "string",
  "username": "string",
  "isPremium": boolean,
  "premiumUntil": "string",
  "profileImage": "string",
  "interests": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "badges": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "icon": "string",
      "rarity": "string"
    }
  ],
  "createdAt": "string"
}
```

### Utilisateurs

#### PUT /user/profile
Mettre à jour le profil utilisateur.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "username": "string",
  "interests": ["string"]
}
```

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "interests": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "profileImage": "string"
}
```

#### POST /user/profile-image
Upload d'une photo de profil.

**Headers:** `Authorization: Bearer <token>`

**Body:** `multipart/form-data`
- `image`: File

**Response:**
```json
{
  "profileImage": "string"
}
```

#### GET /user/discover
Récupérer les profils à découvrir.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `interests`: string[] (optional)

**Response:**
```json
[
  {
    "id": "string",
    "username": "string",
    "profileImage": "string",
    "interests": [
      {
        "id": "string",
        "name": "string"
      }
    ],
    "isPremium": boolean
  }
]
```

#### GET /user/stats
Récupérer les statistiques de l'utilisateur.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "likesSent": number,
  "likesReceived": number,
  "matches": number,
  "messages": number
}
```

### Matching

#### POST /match/like
Liker un utilisateur.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "receiverId": "string"
}
```

**Response:**
```json
{
  "like": {
    "id": "string",
    "senderId": "string",
    "receiverId": "string",
    "createdAt": "string"
  },
  "match": {
    "id": "string",
    "user1Id": "string",
    "user2Id": "string",
    "createdAt": "string",
    "isActive": boolean,
    "user1": {
      "id": "string",
      "username": "string",
      "profileImage": "string"
    },
    "user2": {
      "id": "string",
      "username": "string",
      "profileImage": "string"
    }
  },
  "isMatch": boolean
}
```

#### GET /match/matches
Récupérer les matches de l'utilisateur.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
[
  {
    "id": "string",
    "otherUser": {
      "id": "string",
      "username": "string",
      "profileImage": "string"
    },
    "lastMessage": {
      "content": "string",
      "createdAt": "string",
      "isFromMe": boolean
    },
    "createdAt": "string"
  }
]
```

#### GET /match/likes-received
Récupérer les likes reçus.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
[
  {
    "id": "string",
    "sender": {
      "id": "string",
      "username": "string",
      "profileImage": "string",
      "interests": [
        {
          "id": "string",
          "name": "string"
        }
      ]
    },
    "createdAt": "string"
  }
]
```

#### GET /match/likes-sent
Récupérer les likes envoyés.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
[
  {
    "id": "string",
    "receiver": {
      "id": "string",
      "username": "string",
      "profileImage": "string",
      "interests": [
        {
          "id": "string",
          "name": "string"
        }
      ]
    },
    "createdAt": "string"
  }
]
```

#### DELETE /match/matches/:matchId
Supprimer un match.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": boolean
}
```

### Chat

#### GET /chat/messages/:matchId
Récupérer les messages d'un match.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 50)

**Response:**
```json
[
  {
    "id": "string",
    "content": "string",
    "senderId": "string",
    "messageType": "string",
    "createdAt": "string",
    "sender": {
      "id": "string",
      "username": "string",
      "profileImage": "string"
    }
  }
]
```

#### POST /chat/messages/:matchId/read
Marquer les messages comme lus.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": boolean
}
```

#### GET /chat/stats
Récupérer les statistiques de chat.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "totalMessages": number,
  "activeMatches": number,
  "unreadCount": number
}
```

### Paiements

#### POST /payment/process
Traiter un paiement.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "transactionHash": "string",
  "amount": number,
  "paymentType": "initial" | "monthly"
}
```

**Response:**
```json
{
  "success": boolean,
  "payment": {
    "id": "string",
    "userId": "string",
    "amount": number,
    "currency": "string",
    "transactionHash": "string",
    "paymentType": "string",
    "status": "string",
    "createdAt": "string",
    "confirmedAt": "string"
  },
  "message": "string"
}
```

#### GET /payment/history
Récupérer l'historique des paiements.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "string",
    "amount": number,
    "currency": "string",
    "transactionHash": "string",
    "paymentType": "string",
    "status": "string",
    "createdAt": "string",
    "confirmedAt": "string"
  }
]
```

#### GET /payment/subscription-status
Vérifier le statut d'abonnement.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "isPremium": boolean,
  "premiumUntil": "string",
  "daysRemaining": number
}
```

#### GET /payment/pricing
Récupérer les prix d'abonnement.

**Response:**
```json
{
  "earlyBird": {
    "price": number,
    "currency": "string",
    "description": "string",
    "duration": "string",
    "features": ["string"]
  },
  "regular": {
    "price": number,
    "currency": "string",
    "description": "string",
    "duration": "string",
    "features": ["string"]
  },
  "monthly": {
    "price": number,
    "currency": "string",
    "description": "string",
    "duration": "string",
    "features": ["string"]
  }
}
```

### Gamification

#### GET /gamification/badges
Récupérer les badges de l'utilisateur.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "string",
    "badge": {
      "id": "string",
      "name": "string",
      "description": "string",
      "icon": "string",
      "rarity": "string"
    },
    "earnedAt": "string"
  }
]
```

#### GET /gamification/badges/available
Récupérer tous les badges disponibles.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "icon": "string",
    "rarity": "string"
  }
]
```

#### GET /gamification/leaderboard/referrers
Récupérer le leaderboard des referrers.

**Query Parameters:**
- `limit`: number (default: 10)

**Response:**
```json
[
  {
    "rank": number,
    "id": "string",
    "username": "string",
    "profileImage": "string",
    "referralCount": number
  }
]
```

#### GET /gamification/stats
Récupérer les statistiques de gamification.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "badgeCount": number,
  "referralCount": number,
  "totalReferralReward": number
}
```

#### POST /gamification/referral-code
Créer un code de parrainage.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "code": "string"
}
```

**Response:**
```json
{
  "success": boolean,
  "referral": {
    "id": "string",
    "referrerId": "string",
    "referredId": "string",
    "rewardAmount": number,
    "createdAt": "string"
  },
  "message": "string"
}
```

## WebSocket Events

### Connexion
```javascript
const socket = io('http://localhost:3001');
```

### Events

#### join_room
Rejoindre une room de chat.

```javascript
socket.emit('join_room', { matchId: 'string', userId: 'string' });
```

#### leave_room
Quitter une room de chat.

```javascript
socket.emit('leave_room', { matchId: 'string', userId: 'string' });
```

#### send_message
Envoyer un message.

```javascript
socket.emit('send_message', {
  matchId: 'string',
  senderId: 'string',
  content: 'string',
  messageType: 'text'
});
```

#### typing_start
Indiquer que l'utilisateur commence à taper.

```javascript
socket.emit('typing_start', { matchId: 'string', userId: 'string' });
```

#### typing_stop
Indiquer que l'utilisateur arrête de taper.

```javascript
socket.emit('typing_stop', { matchId: 'string', userId: 'string' });
```

### Events Reçus

#### new_message
Nouveau message reçu.

```javascript
socket.on('new_message', (message) => {
  console.log('Nouveau message:', message);
});
```

#### user_typing
Utilisateur en train de taper.

```javascript
socket.on('user_typing', (data) => {
  console.log('Utilisateur en train de taper:', data);
});
```

## Codes d'Erreur

| Code | Description |
|------|-------------|
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token manquant ou invalide |
| 403 | Forbidden - Accès refusé |
| 404 | Not Found - Ressource non trouvée |
| 409 | Conflict - Conflit (ex: utilisateur déjà existant) |
| 429 | Too Many Requests - Trop de requêtes |
| 500 | Internal Server Error - Erreur serveur |

## Rate Limiting

- **Limite générale** : 100 requêtes par 15 minutes
- **Limite d'authentification** : 5 tentatives par minute
- **Limite d'upload** : 10 uploads par heure

## Exemples d'Utilisation

### Connexion et Création de Profil

```javascript
// 1. Connexion
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: 'user_wallet_address',
    signature: 'signed_message'
  })
});

const { token } = await loginResponse.json();

// 2. Récupérer le profil
const profileResponse = await fetch('/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const user = await profileResponse.json();
```

### Matching et Chat

```javascript
// 1. Liker un utilisateur
const likeResponse = await fetch('/api/match/like', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ receiverId: 'user_id' })
});

// 2. Récupérer les matches
const matchesResponse = await fetch('/api/match/matches', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const matches = await matchesResponse.json();
```

### Paiement

```javascript
// Traiter un paiement
const paymentResponse = await fetch('/api/payment/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    transactionHash: 'solana_transaction_hash',
    amount: 0.1,
    paymentType: 'initial'
  })
});

const payment = await paymentResponse.json();
```
