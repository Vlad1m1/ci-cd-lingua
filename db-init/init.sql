-- Создание таблицы language
CREATE TABLE language (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255)
);

-- Создание таблицы user
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    max_user_id INTEGER,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    photo_url TEXT,
    language_id INTEGER REFERENCES language(id),
    stars INTEGER DEFAULT 0,
    exp INTEGER DEFAULT 0,
    role VARCHAR(20) CHECK (role IN ('user', 'admin')) DEFAULT 'user',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы user_tokens
CREATE TABLE user_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы friends
CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    user2_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    UNIQUE(user1_id, user2_id)
);

-- Создание таблицы friend_request
CREATE TABLE friend_request (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    addressee_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    UNIQUE(requester_id, addressee_id)
);

-- Создание таблицы duel
CREATE TABLE duel (
    id SERIAL PRIMARY KEY,
    winner_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    loser_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    stars INTEGER DEFAULT 0
);

-- Создание таблицы audio_media
CREATE TABLE audio_media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    mimetype VARCHAR(100),
    duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы module
CREATE TABLE module (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    language_id INTEGER NOT NULL REFERENCES language(id),
    icon VARCHAR(255)
);

-- Создание таблицы level
CREATE TABLE level (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    module_id INTEGER NOT NULL REFERENCES module(id) ON DELETE CASCADE,
    quests_count INTEGER DEFAULT 0
);

-- Создание таблицы user_level
CREATE TABLE user_level (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    level_id INTEGER NOT NULL REFERENCES level(id) ON DELETE CASCADE,
    quests_count INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    UNIQUE(user_id, level_id)
);

-- Создание таблицы quest
CREATE TABLE quest (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    level_id INTEGER NOT NULL REFERENCES level(id) ON DELETE CASCADE
);

-- Создание таблицы quest_match_words
CREATE TABLE quest_match_words (
    id SERIAL PRIMARY KEY,
    quest_id INTEGER NOT NULL REFERENCES quest(id) ON DELETE CASCADE,
    word VARCHAR(255) NOT NULL,
    translate VARCHAR(255) NOT NULL
);

-- Создание таблицы words
CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    audio_media_id INTEGER REFERENCES audio_media(id),
    value VARCHAR(255) NOT NULL
);

-- Создание таблицы sentence
CREATE TABLE sentence (
    id SERIAL PRIMARY KEY,
    audio_media_id INTEGER REFERENCES audio_media(id),
    text TEXT NOT NULL
);

-- Создание таблицы sentence_words
CREATE TABLE sentence_words (
    id SERIAL PRIMARY KEY,
    sentence_id INTEGER NOT NULL REFERENCES sentence(id) ON DELETE CASCADE,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    position INTEGER NOT NULL
);

-- Создание таблицы distractor
CREATE TABLE distractor (
    id SERIAL PRIMARY KEY
);

-- Создание таблицы distractor_words
CREATE TABLE distractor_words (
    id SERIAL PRIMARY KEY,
    distractor_id INTEGER NOT NULL REFERENCES distractor(id) ON DELETE CASCADE,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE
);

-- Создание таблицы quest_dictation
CREATE TABLE quest_dictation (
    id SERIAL PRIMARY KEY,
    quest_id INTEGER NOT NULL UNIQUE REFERENCES quest(id) ON DELETE CASCADE,
    audio_media_id INTEGER REFERENCES audio_media(id),
    correct_sentence_id INTEGER REFERENCES sentence(id),
    distractor_id INTEGER REFERENCES distractor(id)
);

-- Создание таблицы quest_translate
CREATE TABLE quest_translate (
    id SERIAL PRIMARY KEY,
    quest_id INTEGER NOT NULL UNIQUE REFERENCES quest(id) ON DELETE CASCADE,
    source_sentence TEXT NOT NULL,
    correct_sentence_id INTEGER REFERENCES sentence(id),
    distractor_id INTEGER REFERENCES distractor(id)
);

-- Создание индексов для улучшения производительности
CREATE INDEX idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX idx_user_tokens_token ON user_tokens(token);
CREATE INDEX idx_friends_user1_id ON friends(user1_id);
CREATE INDEX idx_friends_user2_id ON friends(user2_id);
CREATE INDEX idx_friend_request_requester_id ON friend_request(requester_id);
CREATE INDEX idx_friend_request_addressee_id ON friend_request(addressee_id);
CREATE INDEX idx_duel_winner_id ON duel(winner_id);
CREATE INDEX idx_duel_loser_id ON duel(loser_id);
CREATE INDEX idx_user_language_id ON "user"(language_id);
CREATE INDEX idx_module_language_id ON module(language_id);
CREATE INDEX idx_level_module_id ON level(module_id);
CREATE INDEX idx_user_level_user_id ON user_level(user_id);
CREATE INDEX idx_user_level_level_id ON user_level(level_id);
CREATE INDEX idx_quest_level_id ON quest(level_id);
CREATE INDEX idx_quest_match_words_quest_id ON quest_match_words(quest_id);
CREATE INDEX idx_sentence_words_sentence_id ON sentence_words(sentence_id);
CREATE INDEX idx_sentence_words_word_id ON sentence_words(word_id);
CREATE INDEX idx_distractor_words_distractor_id ON distractor_words(distractor_id);
CREATE INDEX idx_distractor_words_word_id ON distractor_words(word_id);