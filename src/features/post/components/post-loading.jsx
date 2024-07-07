import React from "react";
import styled from "styled-components";
import Skeleton from "~/components/ui/skeleton/skeleton";
const Box = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
`;
const BoxHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
`;
const BoxItemHeader = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 5px;
`;
const BoxLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;
const SBoxPadding = styled.div`
  padding: 10px;
  padding-bottom: 10px;
`;
const SBoxAction = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 100px;
  margin-bottom: 10px;
  justify-content: space-evenly;
`;
const PostLoading = () => {
  return (
    <>
      <Box>
        <BoxHeader>
          <SBoxPadding>
            <BoxLeft>
              <Skeleton width="40px" height="40px" variant="circle" />
              <BoxItemHeader>
                <Skeleton width="250px" height="10px" />
                <Skeleton width="100px" height="10px" />
                <Skeleton width="30px" height="7px" />
              </BoxItemHeader>
            </BoxLeft>
          </SBoxPadding>
        </BoxHeader>
        <SBoxPadding>
          <SBoxAction>
            <Skeleton width="70px" height="10px" />
            <Skeleton width="70px" height="10px" />
            <Skeleton width="70px" height="10px" />
          </SBoxAction>
        </SBoxPadding>
      </Box>

      <Box>
        <BoxHeader>
          <SBoxPadding>
            <BoxLeft>
              <Skeleton width="40px" height="40px" variant="circle" />
              <BoxItemHeader>
                <Skeleton width="250px" height="10px" />
                <Skeleton width="100px" height="10px" />
                <Skeleton width="30px" height="7px" />
              </BoxItemHeader>
            </BoxLeft>
          </SBoxPadding>
        </BoxHeader>
        <SBoxPadding>
          <SBoxAction>
            <Skeleton width="70px" height="10px" />
            <Skeleton width="70px" height="10px" />
            <Skeleton width="70px" height="10px" />
          </SBoxAction>
        </SBoxPadding>
      </Box>
    </>
  );
};

export default PostLoading;
