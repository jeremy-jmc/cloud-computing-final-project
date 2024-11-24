# Especificación Detallada de APIs

## 1. API Usuarios (Python)

### 1.1 POST /auth/signup
Registro de nuevos usuarios en el sistema.

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Usuario Ejemplo",
  "age": 25,
  "country": "Peru",
  "preferences": {
    "favorite_genres": ["rock", "jazz"],
    "language": "es"
  }
}
```

**Response:** (201 Created)
```json
{
  "status": "success",
  "data": {
    "user_id": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo",
    "created_at": "2024-03-17T10:30:00Z",
    "preferences": {
      "favorite_genres": ["rock", "jazz"],
      "language": "es"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.2 POST /auth/login
Autenticación de usuarios existentes.

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "user": {
      "email": "usuario@ejemplo.com",
      "name": "Usuario Ejemplo",
      "last_login": "2024-03-17T10:35:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.3 GET /auth/validate
Validación de token JWT.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "valid": true,
    "user": {
      "email": "usuario@ejemplo.com",
      "tenant_id": "usuario@ejemplo.com",
      "exp": 1710672000
    }
  }
}
```

## 2. API Canciones (Python)

### 2.1 GET /songs
Listar canciones con filtros.

**Query Parameters:**
```
artist_id?: string
genre?: string
popularity?: number
limit?: number (default: 20)
offset?: number (default: 0)
```

**JSON Request**

```json
{
    "artist_id": "coldplay",
    "song_title": "Yellow",
    "album_name": "Parachutes",
    "limit": 20,
    "offset": 0
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "songs": [
      {
        "artist_id": "coldplay",
        "song_title": "Yellow",
        "album_name": "Parachutes",
        "duration": 255,
        "popularity": 85,
        "genres": ["alternative rock", "pop"],
        "release_date": "2000-06-26"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 20,
      "offset": 0,
      "next": "/songs?offset=20"
    }
  }
}
```

### 2.2 GET /songs/{artist_id}/{song_title}
Obtener detalles de una canción específica.

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "song": {
      "artist_id": "coldplay",
      "song_title": "Yellow",
      "album_name": "Parachutes",
      "duration": 255,
      "popularity": 85,
      "genres": ["alternative rock", "pop"],
      "release_date": "2000-06-26",
      "lyrics": "Look at the stars...",
      "streaming_url": "https://api.spotify.clone/stream/yellow",
      "stats": {
        "total_plays": 15000000,
        "monthly_plays": 500000
      }
    }
  }
}
```

## 3. API Playlists (Python)

### 3.1 POST /playlists
Crear nueva playlist.

**Request:**
```json
{
  "name": "Mi Playlist Favorita",
  "description": "Una colección de mis canciones favoritas",
  "public": true,
  "songs": [
    {
      "artist_id": "coldplay",
      "song_title": "Yellow",
      "position": 1
    }
  ]
}
```

**Response:** (201 Created)
```json
{
  "status": "success",
  "data": {
    "playlist": {
      "playlist_name": "Mi Playlist Favorita",
      "user_email": "usuario@ejemplo.com",
      "description": "Una colección de mis canciones favoritas",
      "public": true,
      "created_at": "2024-03-17T11:00:00Z",
      "songs_number": 1,
      "total_time": 255
    }
  }
}
```

### 3.2 PUT /playlists/{playlist_name}/songs
Añadir o actualizar canciones en playlist.

**Request:**
```json
{
  "songs": [
    {
      "artist_id": "imaginedragons",
      "song_title": "Believer",
      "position": 2
    }
  ]
}
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "updated_playlist": {
      "playlist_name": "Mi Playlist Favorita",
      "songs_number": 2,
      "total_time": 489,
      "last_updated": "2024-03-17T11:05:00Z"
    }
  }
}
```

## 4. API Artistas (Node.js)

### 4.1 GET /artists
Listar artistas.

**Query Parameters:**
```
genre?: string
popularity?: number
limit?: number (default: 20)
offset?: number (default: 0)
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "artists": [
      {
        "artist_name": "Coldplay",
        "genres": ["alternative rock", "pop"],
        "popularity": 92,
        "monthly_listeners": 45000000,
        "total_songs": 156,
        "biography": "Coldplay is a British rock band...",
        "image_url": "https://cdn.spotify.clone/artists/coldplay.jpg"
      }
    ],
    "pagination": {
      "total": 1000,
      "limit": 20,
      "offset": 0,
      "next": "/artists?offset=20"
    }
  }
}
```

### 4.2 GET /artists/{artist_name}
Obtener perfil detallado de artista.

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "artist": {
      "artist_name": "Coldplay",
      "genres": ["alternative rock", "pop"],
      "popularity": 92,
      "monthly_listeners": 45000000,
      "biography": "Coldplay is a British rock band...",
      "image_url": "https://cdn.spotify.clone/artists/coldplay.jpg",
      "albums": [
        {
          "album_title": "Parachutes",
          "release_date": "2000-06-26",
          "total_songs": 10
        }
      ],
      "top_songs": [
        {
          "song_title": "Yellow",
          "popularity": 85,
          "album_name": "Parachutes"
        }
      ],
      "stats": {
        "total_plays": 1500000000,
        "monthly_plays": 45000000
      }
    }
  }
}
```

## 5. API Álbumes (Node.js)

### 5.1 GET /albums
Listar álbumes.

**Query Parameters:**
```
artist_id?: string
year?: number
limit?: number (default: 20)
offset?: number (default: 0)
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "albums": [
      {
        "artist_id": "coldplay",
        "album_title": "Parachutes",
        "release_date": "2000-06-26",
        "total_songs": 10,
        "duration": 2520,
        "genres": ["alternative rock", "pop"],
        "cover_url": "https://cdn.spotify.clone/albums/parachutes.jpg"
      }
    ],
    "pagination": {
      "total": 100,
      "limit": 20,
      "offset": 0,
      "next": "/albums?offset=20"
    }
  }
}
```

### 5.2 GET /albums/{artist_id}/{album_title}
Obtener detalles de un álbum específico.

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "album": {
      "artist_id": "coldplay",
      "album_title": "Parachutes",
      "release_date": "2000-06-26",
      "total_songs": 10,
      "duration": 2520,
      "genres": ["alternative rock", "pop"],
      "cover_url": "https://cdn.spotify.clone/albums/parachutes.jpg",
      "songs": [
        {
          "song_title": "Yellow",
          "duration": 255,
          "track_number": 1,
          "popularity": 85
        }
      ],
      "stats": {
        "total_plays": 50000000,
        "monthly_plays": 1500000
      }
    }
  }
}
```

## 6. API Estadísticas (Node.js)

### 6.1 GET /stats/user/{user_id}
Obtener estadísticas de usuario.

**Query Parameters:**
```
timeframe?: string (daily, weekly, monthly, yearly)
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "user_stats": {
      "total_listening_time": 360000,
      "favorite_genres": [
        {
          "genre": "rock",
          "percentage": 45
        },
        {
          "genre": "pop",
          "percentage": 30
        }
      ],
      "top_artists": [
        {
          "artist_name": "Coldplay",
          "play_count": 500
        }
      ],
      "top_songs": [
        {
          "song_title": "Yellow",
          "artist_id": "coldplay",
          "play_count": 50
        }
      ],
      "listening_history": {
        "daily": [
          {
            "date": "2024-03-17",
            "minutes": 180
          }
        ]
      }
    }
  }
}
```

### 6.2 GET /stats/global
Obtener estadísticas globales.

**Query Parameters:**
```
timeframe?: string (daily, weekly, monthly, yearly)
tenant_id: string (requerido)
```

**Response:** (200 OK)
```json
{
  "status": "success",
  "data": {
    "global_stats": {
      "total_users": 1000000,
      "total_songs_played": 50000000,
      "average_daily_listening": 120,
      "top_genres": [
        {
          "genre": "pop",
          "percentage": 35
        }
      ],
      "trending_artists": [
        {
          "artist_name": "Coldplay",
          "change_percentage": 15
        }
      ],
      "trending_songs": [
        {
          "song_title": "Yellow",
          "artist_id": "coldplay",
          "change_percentage": 25
        }
      ]
    }
  }
}
```

## Errores Comunes

Todas las APIs utilizan el siguiente formato para errores:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": {
      "field": "Detalles específicos del error"
    }
  }
}
```

### Códigos de Error Comunes:

- 400 Bad Request
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Los datos proporcionados son inválidos",
    "details": {
      "email": "Formato de email inválido"
    }
  }
}
```

- 401 Unauthorized
```json
{
  "status": "error",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o expirado"
  }
}
```

- 403 Forbidden
```json
{
  "status": "error",
  "error": {
    "code": "FORBIDDEN",
    "message": "No tiene permisos para acceder a este recurso"
  }
}
```

- 404 Not Found
```json
{
  "status": "error",
  "error": {
    "code": "NOT_FOUND",
    "message": "El recurso solicitado no existe"
  }
}
```

- 429 Too Many Requests
```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Ha excedido el límite de solicitudes",
    "details": {
      "retry_after": 60
    }
  }
}
```