# PROYECTO FINAL CLOUD COMPUTING

- **Integrantes:** Máximo 5 personas por grupo
- **Funcionalidad:** Usted elegirá la funcionalidad  a implementar. Ejemplo: Sistema para un  Banco, para una compañía de Seguros, para  una cadena de cines, para una aerolínea, para una casa de apuestas en línea, para una tienda de Comercio Electrónico, para un videojuego en línea, para streaming de música como Spotify, etc.
- **Arquitectura:**
    - Multi-tenancy

## RUBRICA
- BackEnd (7 puntos)
- FrontEnd (4 puntos)
- Data Science (6 puntos)
- Diagrama de Arquitectura Solución (1 punto)
- Exposición presencial (2 puntos)

### BACKEND

- **Bases de Datos:** Deberá usar DynamoDB en todas las Apis. Debe diseñar la clave de partición y clave de ordenamiento como Multi-tenancy y priorizando consultas por query y no por scan. Debe tener como mínimo 1 “Global secondary index (GSI)” y 1 “Local secondary index (LSI)”. Debe configurar en cada tabla DynamoDB la funcionalidad de “Copias de seguridad - Recuperación a un momento dado(PITR)”. Debe presentar un diagrama donde relacione lógicamente todas las tablas DynamoDB y se muestre la estructura json de cada tabla.
- **Seguridad:** Deberá tener un Api Usuarios Multi-tenancy que permita crear usuario, login usuario y validar token de acceso. Todas las demás Apis deben estar protegidas con token de acceso.
- **Microservicios:** Debe implementar como mínimo 6 Apis Multi-tenancy con Lambdas y Api Gateway incluyendo al Api Usuarios. Debe automatizar su despliegue con framework serverless en 3 stages (dev, test y prod) incluyendo las tablas DynamoDB. Debe implementar la mitad de lambdas en python y la otra mitad en node.js.
- **Datos de prueba:** Debe insertar masivamente, por única vez, datos ficticios (fake data) en todas las tablas DynamoDB (Mínimo 10,000 registros x tabla repartidos entre 3 tenant_id diferentes).
- **Documentación:** Debe documentar las 6 apis para visualizarlas en swagger-ui.
- **Código Fuente:** Debe incluir enlaces a repositorios públicos de github con las fuentes


## FRONTEND

- Debe implementar una página web Multi-tenancy con login de usuario y desplegarla en un bucket S3 de AWS (Simple Storage Service) y que invoque a los 6 microservicios (como mínimo a 1 método de cada api rest). Deben existir 3 buckets S3, uno por cada stage (dev, test, prod) y que invoquen a las apis respectivas.
- Puede usar el framework web del lado del cliente de su preferencia. Ejemplos:
    - Javascript puro
    - Javascript con framework: react.js, angular.js, vue.js
- Debe incluir enlace a repositorio público de github con las fuentes.

## DATA SCIENCE

- **Cómputo:** Debe crear una máquina virtual “MV Ciencia Datos” por cada stage (dev, test, prod) con tipo de instancia "t2.medium" (2 vCPU, 4 GB RAM).
- **Almacenamiento:** Debe crear un bucket S3 por cada stage (dev, test, prod) para almacenar la ingesta de datos.
- **Ingesta de datos:**  Debe implementar 5 contenedores docker en python para la ingesta de datos con estrategia pull del 100% de los registros de las tablas  DynamoDB. Cada contenedor ingestará la data de 1 microservicio y generará archivos csv o json normalizados que cargue en el bucket S3. Se recomienda usar la funcionalidad de scan de DynamoDB (*) tomando en cuenta que DynamoDB pagina los resultados de las operaciones de scan. Con la paginación, los resultados del scan se dividen en "páginas" de datos que tienen un tamaño de 1 MB (o menos).
- **Catálogo de Datos:** Debe implementar un catálogo de datos en AWS Glue por cada archivo con estructura diferente que cargue al bucket S3. Debe crear un diagrama Entidad / Relación que relacione todas las tablas del catálogo de datos.
- **Analítica de Datos:** Debe mostrar evidencia de como mínimo 6 consultas SQL Multi-tenancy que unan varias tablas con AWS Athena y crear como mínimo 3 vistas Multi-tenancy.
- **Transformación:** Debe implementar 1 contenedor docker ETL (Extract, Transform, Load) en python que ejecute queries SQL con Athena e inserte los resultados en tablas resúmenes de BD MySQL (Utilizar MySQL en contenedor en “MV Ciencia Datos”). Debe crear un diagrama Entidad / Relación que relacione **todas las tablas** resúmenes.
- **Logs:** Los 6 contenedores deberán dejar archivos de logs con el mismo formato en un mismo directorio de la máquina virtual “MV Ciencia Datos” que tengan como mínimo: fecha_hora (hasta milisegundo), tipo_log (INFO, WARNING, ERROR, CRITICAL), nombre_contenedor, mensaje. Deberá mostrar evidencia de ejecución de queries sobre los logs con `lnav` para mostrar por cada contenedor su hora de inicio y fin, cantidad de registros procesados y los pasos más importantes del proceso con la información más relevante.
- **Dashboard o Panel de Control:** Debe implementar un Dashboard (Informe) Multi-tenancy en Google Looker Studio que utilice como fuente de datos la BD MySQL y tenga 10 gráficos de 5 tipos diferentes y 2 filtros como mínimo. Revise estos enlaces para Looker Studio:** enlace1, enlace2.
- **Código Fuente:** Debe incluir enlaces a repositorios públicos de github con las fuentes.

<!-- (*) Referencia:** https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html -->

## DIAGRAMA DE ARQUITECTURA DE SOLUCIÓN
Debe elaborar un Diagrama de Arquitectura de Solución que incluya y relacione todos los  componentes de:

- BackEnd
- FrontEnd
- Data Science




### 1. Funcionalidad Principal

Sistema de streaming musical multi-tenant que permite a diferentes organizaciones (tenants) tener su propia plataforma de música. Cada tenant podría ser:
* Sellos discográficos independientes
* Plataformas de radio online
* Servicios de música regional/local
* Plataformas educativas de música

### 2. APIs Propuestas (6 microservicios)

1. **API Usuarios** (Python)
   - Registro/Login de usuarios
   - Gestión de perfiles
   - Validación de tokens
   - Multi-tenant authentication

2. **API Canciones** (Python)
   - CRUD de canciones
   - Gestión de metadata
   - Enlaces de streaming
   - Búsqueda y filtrado

3. **API Playlists** (Python)
   - Creación/edición de playlists
   - Compartir playlists
   - Playlists colaborativas
   - Playlists automáticas

4. **API Artistas** (Node.js)
   - Perfiles de artistas
   - Discografías
   - Biografías
   - Estadísticas básicas

5. **API Álbumes** (Node.js)
   - Gestión de álbumes
   - Metadata de álbumes
   - Organización de tracks
   - Arte y descripciones

6. **API Estadísticas** (Node.js)
   - Métricas de reproducciones
   - Tendencias
   - Análisis de usuario
   - Reportes de uso


### 3. Análisis de Datos

Consultas SQL Multi-tenant propuestas:
1. Top canciones por reproducciones por tenant
2. Comportamiento de usuarios por género musical
3. Análisis de playlists más populares
4. Patrones de escucha por hora/día
5. Retención de usuarios por tipo de contenido
6. Análisis de artistas emergentes

### 4. Dashboard en Looker Studio

Gráficos propuestos:
1. Mapa de calor de actividad por hora/día
2. Gráfico de barras de géneros más escuchados
3. Gráfico circular de distribución de usuarios por plan
4. Serie temporal de nuevos usuarios
5. Gráfico de embudo de conversión
6. Gráfico de dispersión de engagement vs retención
7. Treemap de categorías de música
8. Gráfico de área de crecimiento de biblioteca
9. Gráfico de barras apiladas de tipos de dispositivos
10. Gráfico de líneas de tendencias de escucha

```mermaid
flowchart TD
    subgraph Frontend
        S3_Web["S3 Buckets (dev/test/prod)"]
        WebApp["React Web App (Multi-tenant)"]
    end

    subgraph Backend ["Backend (APIs Lambda + API Gateway)"]
        Auth["API Usuarios (Python)"]
        Songs["API Canciones (Python)"]
        Playlists["API Playlists (Python)"]
        Artists["API Artistas (Node.js)"]
        Albums["API Álbumes (Node.js)"]
        Stats["API Estadísticas (Node.js)"]
        
        DDB[(DynamoDB Multi-tenant)]
    end

    subgraph DataScience ["Data Science"]
        VM["MV Ciencia Datos (t2.medium)"]
        S3_Data["S3 Buckets Data (dev/test/prod)"]
        
        subgraph Containers ["Docker Containers"]
            C1["Ingesta Canciones"]
            C2["Ingesta Playlists"]
            C3["Ingesta Artistas"]
            C4["Ingesta Álbumes"]
            C5["Ingesta Estadísticas"]
            ETL["Container ETL"]
        end
        
        Glue["AWS Glue Catálogo"]
        Athena["AWS Athena Consultas SQL"]
        MySQL[(MySQL DB Resúmenes)]
        Looker["Google Looker Dashboard"]
    end

    WebApp --> Backend
    Backend --> DDB
    DDB --> Containers
    Containers --> S3_Data
    S3_Data --> Glue
    Glue --> Athena
    Athena --> ETL
    ETL --> MySQL
    MySQL --> Looker
```


```mermaid
erDiagram
    Users {
        string tenant_id PK "Partition Key | Ejemplo: 'SPOTIFY-FREE'"
        string user_name "Sort Key | Ejemplo: 'USR#123456'"
        string email "usuario@email.com"
        string name "Juan Pérez"
        string lastname "Ayala Guanilo"
        timestamp last_login "2024-03-15T10:30:00Z"
        string role "user"
    }

    Songs {
        string tenant_id PK "Partition Key | Ejemplo: 'UNIVERSAL-MUSIC'"
        string song_id "Sort Key | Ejemplo: 'ARTIST_ID#ALBUM_ID#SONG_NAME'"
        string title "Bohemian Rhapsody"
        number duration "354"
        number popularity "98"
        array genres "['rock', 'classic rock']"
        string audio_url "s3://bucket/songs/789.mp3"
    }

    Artists {
        string tenant_id PK "Partition Key | Ejemplo: 'UNIVERSAL-MUSIC'"
        string artist_name "Sort Key | Ejemplo: 'Queen'"
        array genres "['rock', 'pop']"
        string bio "Legendary British rock band..."
        number monthly_listeners "45000000"
        number popularity "95"
        timestamp created_at "2024-01-01T00:00:00Z"
    }

    Albums {
        string tenant_id PK "Partition Key | Ejemplo: 'UNIVERSAL-MUSIC'"
        string album_id "Sort Key | Ejemplo: 'ALBUM_ID'"
        string title "A Night at the Opera"
        string artist_id "ART#456"
        date release_date "1975-11-21"
        array genres "['rock', 'classic rock']"
        number total_tracks "12"
        number popularity "94"
    }

    Playlists {
        string tenant_id PK "Partition Key | Ejemplo: 'REGION#LATAM'"
        string playlist_id "Sort Key | Ejemplo: 'PLY#321'"
        string name "My Rock Classics"
        string user_id "USR#123456"
        number followers "156"
        timestamp last_updated "2024-03-20T15:45:00Z"
        boolean is_public "true"
    }

    PlaylistSongs {
        string tenant_id PK "Partition Key | Ejemplo: 'GENRE#ROCK'"
        string playlist_song_id "Sort Key | Ejemplo: 'PLY#321#SONG#789'"
        string playlist_id "PLY#321"
        string song_id "SONG#789"
        number position "1"
        timestamp added_at "2024-03-20T15:45:00Z"
        string added_by "USR#123456"
    }

    PlaybackStats {
        string tenant_id PK "Partition Key | Ejemplo: 'COUNTRY#PE'"
        string stat_id "Sort Key | Ejemplo: '2024-03-20#USR123#SONG789'"
        string song_id "SONG#789"
        string user_id "USR#123456"
        timestamp played_at "2024-03-20T14:30:00Z"
        number duration_played "180"
        string context_type "playlist"
        string device_type "mobile"
    }

    Users ||--o{ Playlists : "creates"
    Songs ||--o{ PlaybackStats : "played in"
    Artists ||--o{ Songs : "creates"
    Albums ||--o{ Songs : "contains"
    Users ||--o{ PlaybackStats : "generates"
    Playlists ||--o{ PlaylistSongs : "contains"
    Songs ||--o{ PlaylistSongs : "belongs to"
```

