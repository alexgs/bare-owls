-- Prior to 2021-09-21, the schema and seed data was managed by Prisma.

-- TODO Add PGSQL `genUuid` function as default for all UUID PK columns

--[ # TRIGGERS # ]--

-- See https://x-team.com/blog/automatic-timestamps-with-postgresql/
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
    RETURNS TRIGGER AS
$$
BEGIN
    new.updated_at = NOW();
    RETURN new;
END;
$$ LANGUAGE plpgsql;

--[ # TABLE public.channels # ]--

CREATE TABLE IF NOT EXISTS public.channels
(
    id         UUID                                                     NOT NULL
        CONSTRAINT channels_pk
            PRIMARY KEY,
    slug       TEXT                                                     NOT NULL,
    title      TEXT                                                     NOT NULL,
    owner_id   UUID                                                     NOT NULL
        CONSTRAINT channels_owner_id_fk
            REFERENCES user_accounts
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    created_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(3) WITHOUT TIME ZONE                           NOT NULL
);

-- pg_dump output has statement here `ALTER TABLE OWNER`. Do we need that?

CREATE UNIQUE INDEX channels_slug_key
    ON channels (slug);

CREATE UNIQUE INDEX channels_owner_id_unique
    ON channels (owner_id);

CREATE TRIGGER set_channels_updated_at
    BEFORE UPDATE
    ON channels
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();

--[ # TABLE public.channel_subscriptions # ]--

CREATE TABLE IF NOT EXISTS public.channel_subscriptions
(
    id         SERIAL                                                   NOT NULL
        CONSTRAINT channel_subscriptions_pk
            PRIMARY KEY,
    channel_id UUID                                                     NOT NULL
        CONSTRAINT channel_subscriptions_channel_id_fk
            REFERENCES channels
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    tier_id    INTEGER                                                  NOT NULL
        CONSTRAINT channel_subscriptions_tier_id_fk
            REFERENCES channel_tiers
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    user_id    UUID                                                     NOT NULL
        CONSTRAINT channel_subscriptions_user_id_fk
            REFERENCES user_accounts
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    created_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(3) WITHOUT TIME ZONE                           NOT NULL
);

CREATE UNIQUE INDEX channel_subscriptions_channel_id_user_id_key
    ON channel_subscriptions (channel_id, user_id);

CREATE TRIGGER set_channel_subscriptions_updated_at
    BEFORE UPDATE
    ON channel_subscriptions
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();

--[ # TABLE public.channel_tiers # ]--

CREATE TABLE IF NOT EXISTS public.channel_tiers
(
    id          SERIAL                                                   NOT NULL
        CONSTRAINT channel_tiers_pk
            PRIMARY KEY,
    name        TEXT                                                     NOT NULL,
    description TEXT                                                     NOT NULL,
    slug        TEXT                                                     NOT NULL,
    level       INTEGER                                                  NOT NULL,
    channel_id  UUID                                                     NOT NULL
        CONSTRAINT channel_tiers_channel_id_fk
            REFERENCES channels
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    created_at  TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP(3) WITHOUT TIME ZONE                           NOT NULL
);

CREATE UNIQUE INDEX channel_tiers_channel_id_level_key
    ON channel_tiers (channel_id, level);

CREATE UNIQUE INDEX channel_tiers_channel_id_slug_key
    ON channel_tiers (channel_id, slug);

CREATE TRIGGER set_channel_tiers_updated_at
    BEFORE UPDATE
    ON channel_tiers
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();

--[ # TABLE public.posts # ]--

CREATE TABLE IF NOT EXISTS public.posts
(
    id           UUID                                                     NOT NULL
        CONSTRAINT posts_pk PRIMARY KEY,
    public_id    CHARACTER VARYING(5)                                     NOT NULL,
    body         TEXT                                                     NOT NULL,
    channel_id   UUID                                                     NOT NULL
        CONSTRAINT posts_channel_id_fk
            REFERENCES public.channels
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    tier_id      INTEGER                                                  NOT NULL
        CONSTRAINT posts_tier_id_fk
            REFERENCES public.channel_tiers
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    author_id    UUID                                                     NOT NULL
        CONSTRAINT posts_author_id_fk
            REFERENCES public.user_accounts
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    created_at   TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published_at TIMESTAMP(3) WITHOUT TIME ZONE,
    updated_at   TIMESTAMP(3) WITHOUT TIME ZONE                           NOT NULL,
    ppv_price    INTEGER
);

CREATE UNIQUE INDEX posts_channel_id_public_id_key
    ON posts (channel_id, public_id);

CREATE TRIGGER set_posts_updated_at
    BEFORE UPDATE
    ON posts
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();

--[ # TABLE public.user_accounts # ]--

CREATE TABLE IF NOT EXISTS public.user_accounts
(
    id           UUID                                                     NOT NULL
        CONSTRAINT user_accounts_pk
            PRIMARY KEY,
    username     TEXT                                                     NOT NULL,
    display_name TEXT,
    created_at   TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at   TIMESTAMP(3) WITHOUT TIME ZONE                           NOT NULL,
    role_id      UUID                                                     NOT NULL
        CONSTRAINT user_accounts_role_id_fk
            REFERENCES user_roles
            ON DELETE CASCADE
            ON UPDATE CASCADE
);

CREATE UNIQUE INDEX user_accounts_username_key
    ON user_accounts (username);

CREATE TRIGGER set_user_accounts_updated_at
    BEFORE UPDATE
    ON user_accounts
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();

--[ # TABLE public.user_blocks # ]--

CREATE TABLE IF NOT EXISTS public.user_blocks
(
    id         SERIAL                                                   NOT NULL
        CONSTRAINT user_block_pk
            PRIMARY KEY,
    blocker_id UUID                                                     NOT NULL
        CONSTRAINT user_block_blocker_id_fk
            REFERENCES user_accounts
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    target_id  UUID                                                     NOT NULL
        CONSTRAINT user_block_target_id_fk
            REFERENCES user_accounts
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    created_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(3) WITHOUT TIME ZONE                           NOT NULL
);

CREATE TRIGGER set_user_blocks_updated_at
    BEFORE UPDATE
    ON user_blocks
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();

--[ # TABLE public.user_emails # ]--

CREATE TABLE IF NOT EXISTS public.user_emails
(
    id         INTEGER                                                  NOT NULL
        CONSTRAINT user_email_pk
            PRIMARY KEY,
    original   TEXT                                                     NOT NULL,
    simplified TEXT                                                     NOT NULL,
    account_id UUID                                                     NOT NULL
        CONSTRAINT user_email_account_id_fk
            REFERENCES user_accounts
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    verified   BOOLEAN                        DEFAULT FALSE             NOT NULL,
    created_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(3) WITHOUT TIME ZONE                           NOT NULL
);

CREATE UNIQUE INDEX user_email_original_key
    ON user_emails (original);

CREATE INDEX user_email_simplified_index
    ON user_emails (simplified);

CREATE TRIGGER set_user_emails_updated_at
    BEFORE UPDATE
    ON user_emails
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();

--[ # TABLE public.user_roles # ]--

CREATE TABLE IF NOT EXISTS public.user_roles
(
    id           UUID                                                     NOT NULL
        CONSTRAINT user_role_pk
            PRIMARY KEY,
    name         TEXT                                                     NOT NULL,
    display_name TEXT                                                     NOT NULL,
    description  TEXT                                                     NOT NULL,
    created_at   TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at   TIMESTAMP(3) WITHOUT TIME ZONE                           NOT NULL
);

CREATE UNIQUE INDEX user_role_name_key
    ON user_roles (name);

CREATE TRIGGER set_user_roles_updated_at
    BEFORE UPDATE
    ON user_roles
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();

--[ # TABLE public.user_unlocked_posts # ]--

CREATE TABLE IF NOT EXISTS public.user_unlocked_posts
(
    id         SERIAL                                                   NOT NULL
        CONSTRAINT user_unlocked_posts_pk
            PRIMARY KEY,
    user_id    UUID                                                     NOT NULL
        CONSTRAINT user_unlocked_posts_user_id_fk
            REFERENCES user_accounts
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    post_id    UUID                                                     NOT NULL
        CONSTRAINT user_unlocked_posts_post_id_fk
            REFERENCES posts
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    created_at TIMESTAMP(3) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(3) WITHOUT TIME ZONE                           NOT NULL
);

CREATE UNIQUE INDEX user_unlocked_posts_post_id_user_id_key
    ON user_unlocked_posts (post_id, user_id);

CREATE TRIGGER set_user_unlocked_posts_updated_at
    BEFORE UPDATE
    ON user_unlocked_posts
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();
