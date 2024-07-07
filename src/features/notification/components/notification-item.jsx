import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import Avatar from "~/components/ui/avatar/avatar";
import { IconButton } from "~/components/ui/button/icon-button";
import { formatTime } from "~/utils/utilTime";
import {
  deleteNotification,
  updateNotification,
} from "../api/notification-api";
import toastify from "~/lib/toastify";

const SBox = styled.div`
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: start;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px;
  cursor: pointer;
  position: relative;
  border-radius: 5px;
  transition: background-color 0.3s;
  ${({ read }) =>
    !read &&
    css`
      background-color: var(--color-primary-50);
    `}
  &:hover {
    background-color: var(--color-primary-100);
  }
`;

const SItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
`;
const SContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const STime = styled.p`
  font-size: 12px;
  color: var(--color-black-500);
  ${({ read }) =>
    !read &&
    css`
      color: var(--color-primary-500);
    `}
`;
const ActionBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  right: 10px;
  top: 50%;
  opacity: 1;
  transform: translateY(-50%);
`;

const NotificationItem = ({ notification, onClickDelete }) => {
  const showToast = toastify();

  const handleClick = async () => {
    await updateNotification(notification.notification_id).then((res) => {
      if (res.code === 200) {
      }
    });
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    await deleteNotification(notification.notification_id).then((res) => {
      if (res.code === 200) {
        onClickDelete(notification.notification_id);
        showToast("notification removed", { type: "success" });
      }
    });
  };
  return (
    <SBox onClick={handleClick} read={notification.readed}>
      <Link to={notification.url}>
        <SItem>
          <Avatar width="60px" height="60px" src={notification.avatar_url} />
          <SContent>
            <p>
              <strong>{notification.name}</strong> {notification.text}
            </p>
            <STime read={notification.readed}>
              {formatTime(notification.created_at)}
            </STime>
          </SContent>
        </SItem>
      </Link>
      <ActionBox>
        <IconButton onClick={handleDelete}>
          <MdClose size="30px" />
        </IconButton>
      </ActionBox>
    </SBox>
  );
};

export default NotificationItem;
