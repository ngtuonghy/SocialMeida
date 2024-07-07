import React from "react";
import styled from "styled-components";
import Skeleton from "~/components/ui/skeleton/skeleton";
const Box = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
`;
const Item = styled.div`
  display: flex;
  gap: 10px;
`;
const NotificationLoading = () => {
  return (
    <Box>
      <Item>
        <div
          style={{
            flex: "1",
          }}
        >
          <Skeleton width="60px" height="60px" variant="circle" />
        </div>
        <Skeleton width="100%" height="60px" />
      </Item>
      <Item>
        <div
          style={{
            flex: "1",
          }}
        >
          <Skeleton width="60px" height="60px" variant="circle" />
        </div>
        <Skeleton width="100%" height="60px" />
      </Item>
    </Box>
  );
};

export default NotificationLoading;
