-- Repeatable migration for the function `post_authorized_claim`. Since this
-- function is tracked in version control here, we don't need to keep migrations
-- for it.

CREATE OR REPLACE FUNCTION public.post_authorized_claim(post_row public.posts) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT post_row.channel_id || ':' || channel_tiers.slug FROM posts JOIN channel_tiers ON post_row.tier_id = channel_tiers.id
$$;
