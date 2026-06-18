CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    display_name  TEXT,
    email         TEXT,
    coins         INTEGER     NOT NULL DEFAULT 1000,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rounds (
    id           BIGSERIAL PRIMARY KEY,
    expiry_time  TIMESTAMPTZ NOT NULL,
    status       TEXT        NOT NULL DEFAULT 'open',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
    id              BIGSERIAL PRIMARY KEY,
    round_id        BIGINT  NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    crypto          TEXT    NOT NULL,
    target_price    NUMERIC NOT NULL,
    correct_answer  TEXT
);

CREATE TABLE IF NOT EXISTS predictions (
    id           BIGSERIAL PRIMARY KEY,
    user_id      TEXT   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id  BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer       TEXT   NOT NULL,
    status       TEXT   NOT NULL DEFAULT 'pending',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, question_id)
);
