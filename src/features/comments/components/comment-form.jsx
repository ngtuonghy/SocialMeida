import { useRef, useState } from "react";
import { useViewport } from "~/context/viewportContext";
import { convertFileToDataURL } from "~/utils/utilFile";
import { LuImage, LuSendHorizonal, LuSmile, LuXCircle } from "react-icons/lu";
import PickerEmoji from "~/lib/picker-emoji";
import InputMultiline from "~/components/ui/text-field/input-multiline";
import { IconButton } from "~/components/ui/button/icon-button";
import styled, { css } from "styled-components";
import useUser from "~/hooks/use-user";
import { useComments } from "../contexts/CommentsContext";
import { addComment, addReplyComment } from "../helpers/create-comment";

const SBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  background-color: var(--color-gray-100);
  border-radius: 13px;
`;
const BoxAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) =>
		props.focusInput
			? css`
          position: relative;
          transition: all 0.7s;
        `
			: css`
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 0;
        `};
`;
const CommentForm = ({ post, comment, setComment, setComments }) => {
	const user = useUser();
	const [dataInput, setDataInput] = useState({
		text: "",
		media: { url: null, type: null, file: null },
	});

	const { width } = useViewport();
	const fileInputRef = useRef(null);

	const handlePostComment = async () => {
		if (post) {
			await addComment(dataInput, post, user, setComments);
		}
		if (comment) {
			await addReplyComment(dataInput, comment, user, setComment);
		}

		setDataInput({
			text: "",
			media: { url: null, type: null, file: null },
		});
	};

	const handleFileDataComment = (e) => {
		convertFileToDataURL(e.target.files[0]).then((url) => {
			setDataInput({
				...dataInput,
				media: { url, type: e.target.files[0].type, file: e.target.files[0] },
			});
		});
	};

	const [focusInput, setFocusInput] = useState(false);
	const [showEmoji, setShowEmoji] = useState(false);

	const handleEmojiSelect = (emoji) => {
		setDataInput({ ...dataInput, text: dataInput.text + emoji.native });
	};

	return (
		<SBox>
			<InputMultiline
				noBorder
				noOutline
				maxHeight={"400px"}
				onChange={(e) => setDataInput({ ...dataInput, text: e.target.value })}
				style={{ outline: "none", border: "none" }}
				onFocus={() => {
					{
						setFocusInput(true);
						setShowEmoji(false);
					}
				}}
				onBlur={() => {
					if (dataInput.text !== "" || dataInput.media.url !== null) {
						setFocusInput(true);
					} else {
						setFocusInput(false);
					}
				}}
				value={dataInput.text}
				autoInserRow={true}
				label="Add a comment..."
				variant={"placeholder"}
				rows={1}
			/>
			<div className="post__comment-actions">
				<BoxAction focusInput={focusInput}>
					<div className="post__comment-box-item">
						{!dataInput.media.url && (
							<div className="post__comment-icon">
								<IconButton onClick={() => fileInputRef.current.click()}>
									<LuImage size={20} />
								</IconButton>

								<input
									ref={fileInputRef}
									onChange={handleFileDataComment}
									className="post__comment-file"
									accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
									type="file"
								/>
							</div>
						)}
						<div>
							<IconButton onClick={() => setShowEmoji(!showEmoji)}>
								<LuSmile size={20} />
							</IconButton>

							<div
								style={{
									position: "absolute",
									zIndex: 10,
								}}
							>
								{showEmoji && (
									<PickerEmoji
										perLine={width < 675 ? 7 : 9}
										onSelected={handleEmojiSelect}
									/>
								)}
							</div>
						</div>
					</div>
					<div className="post__comment-box-item">
						<IconButton onClick={handlePostComment}>
							<LuSendHorizonal size={25} />
						</IconButton>
					</div>
				</BoxAction>
				{dataInput.media.url && (
					<div className="post__comment-preview">
						{dataInput.media.type.includes("image") ? (
							<img
								className="post__comment-media"
								src={dataInput.media.url}
								alt=""
							/>
						) : (
							<video
								className="post__comment-media"
								src={dataInput.media.url}
								controls
							/>
						)}
						<div
							className="
                  post__comment-preview-close"
						>
							<IconButton
								onClick={() =>
									setDataInput({
										...dataInput,
										media: { url: null, type: null, file: null },
									})
								}
							>
								<LuXCircle size={30} />
							</IconButton>
						</div>
					</div>
				)}
			</div>
		</SBox>
	);
};
export default CommentForm;
