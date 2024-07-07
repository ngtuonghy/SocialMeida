import React from "react";
import styled from "styled-components";
import Avatar from "~/components/ui/avatar/avatar";
import MediaViewer from "~/features/media-viewer/components/media-viewer";
import { formatTime } from "~/utils/utilTime";
import Comment from "~/features/comments/components/comment";
import PostAction from "./post-action";
import PostHeader from "./post-header";
const Box = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
`;
const Text = styled.p`
  padding-inline: 10px;
  font-size: 15px;
  margin-top: 5px;
  font-weight: 400;
`;
const SBoxPadding = styled.div`
  padding: 10px;
  padding-bottom: 0;
`;
const PostDisplay = ({ post, scrollableTarget, setReact, react }) => {
  if (!post) return null;
  // console.log(post);
  return (
    <Box>
      <SBoxPadding>
        <PostHeader post={post} />
        <Text>{post.text}</Text>
      </SBoxPadding>
      <MediaViewer media={post.media_urls} />
      <SBoxPadding>
        <PostAction post={post} setReact={setReact} react={react} />
        <Comment post={post} scrollableTarget={scrollableTarget} />
      </SBoxPadding>
    </Box>
  );
};

export default PostDisplay;
