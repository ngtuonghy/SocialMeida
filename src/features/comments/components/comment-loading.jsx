import React from "react";
import styled from "styled-components";
import Skeleton from "~/components/ui/skeleton/skeleton";
const Box = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding-block: 10px;
`;
const Item = styled.div`
  display: flex;
  align-items: start;
  gap: 10px;
  height: 100%;
  width: 100%;
`;
const Info = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 5px;
`;
const CommentLoading = () => {
  return (
    <Box>
      <Item>
        <div
          style={{
            flex: "1",
          }}
        >
          <Skeleton width="32px" height="32px" variant="circle" />
        </div>
        <Info>
          <Skeleton width="70%" height="32px" />
          <Skeleton width="10%" height="5px" />
          <Skeleton width="20%" height="5px" />
        </Info>
      </Item>
      <Item>
        <div
          style={{
            flex: "1",
          }}
        >
          <Skeleton width="32px" height="32px" variant="circle" />
        </div>
        <Info>
          <Skeleton width="50%" height="32px" />
          <Skeleton width="10%" height="5px" />
          <Skeleton width="20%" height="5px" />
        </Info>
      </Item>
      <Item>
        <div
          style={{
            flex: "1",
          }}
        >
          <Skeleton width="32px" height="32px" variant="circle" />
        </div>
        <Info>
          <Skeleton width="30%" height="32px" />
          <Skeleton width="10%" height="5px" />
          <Skeleton width="20%" height="5px" />
        </Info>
      </Item>
    </Box>
  );
};

export default CommentLoading;
