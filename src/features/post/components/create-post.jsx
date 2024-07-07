import React, { useEffect, useRef } from "react";
import { IoMdClose, IoMdArrowBack } from "react-icons/io";
import { CSSTransition } from "react-transition-group";
import { FaUserGroup } from "react-icons/fa6";
import {
  MdPublic,
  MdLock,
  MdOutlineImage,
  MdOutlineAddReaction,
  MdEdit,
  MdClose,
} from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import "./create-post.css";
import { useSelector } from "react-redux";
import { useState } from "react";
// import InputRadio from "~/components/Input/InputRadio";

import { convertFileToDataURL, imageUrlToFile } from "~/utils/utilFile";
import { uploadFiles } from "~/api/uploadImage";
import Cookies from "js-cookie";
import { createPost, updatePost } from "~/api/post";
import Dialog from "~/components/ui/dialog/dialog";
import InputMultiline from "~/components/ui/text-field/input-multiline";
import { generatePublicId } from "~/utils/utilCreateNanoId";
import { InputSizes } from "~/components/ui/text-field";
import MediaViewer from "~/features/media-viewer/components/media-viewer";
import { IconButton } from "~/components/ui/button/icon-button";
import Avatar from "~/components/ui/avatar/avatar";
import { Button } from "~/components/ui/button";
import CropperImage from "~/features/cropper/components/cropper-image";
import { useViewport } from "~/context/viewportContext";
import PickerEmoji from "~/lib/PickerEmoji";
const CreatePost = ({ isModalOpen, setIsModalOpen, data }) => {
  const user = useSelector((state) => state.user.user);

  const [text, setText] = useState("");
  const [valueRadio, setValueRadio] = useState("public");
  const [chooseRadio, setChooseRadio] = useState(valueRadio);

  const [selectedImages, setSelectedImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const [imgEdit, setImgEdit] = useState();
  const [modalCropper, setModalCropper] = useState(false);

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  const [activeMenu, setActiveMenu] = useState("main");
  const [prevActiveMenu, setPrevActiveMenu] = useState("main");

  useEffect(() => {
    if (data) {
      setText(data.text);
      // console.log(data.media_urls);
      setValueRadio(data.visibility);

      if (Array.isArray(data.media_urls)) {
        const filesPromises = data.media_urls.map(async (media) => {
          console.log(media.src);
          return await imageUrlToFile(media.src);
        });

        Promise.all(filesPromises)
          .then((files) => {
            setSelectedImages(files);
          })
          .catch((error) => {
            console.error("Error converting media URLs to files:", error);
          });
      } else {
        // console.error("data.media_urls is not an array");
      }
    }
  }, [data]);

  useEffect(() => {
    setPrevActiveMenu(activeMenu); // Lưu giá trị trước đó của activeMenu vào prevActiveMenu
  }, [activeMenu]); // useEffect sẽ chạy lại khi activeMenu thay đổi

  // Hàm để thay đổi activeMenu
  const changeActiveMenu = (menu) => {
    setPrevActiveMenu(activeMenu); // Lưu trạng thái trước của activeMenu
    setActiveMenu(menu); // Thiết lập activeMenu mới
  };

  const cropperRef = useRef(null);
  useEffect(() => {
    const selectedPreview = preview.find((item) => item.id === selectedFileId);
    if (selectedPreview) {
      setImgEdit(selectedPreview.src);
    }
  }, [selectedFileId]);

  // console.log("imgEdit", imgEdit);
  const itemsPrivacy = [
    {
      icon: <MdPublic />,
      label: "Public",
      value: "public",
    },
    {
      icon: <MdLock />,
      label: "Only me",
      value: "private",
    },
    {
      icon: <FaUserGroup />,
      label: "Friends",
      value: "friends",
    },
  ];

  const handleRadioChange = (e) => {
    setValueRadio(e.target.value);
  };

  useEffect(() => {
    setValueRadio(chooseRadio);
  }, [activeMenu]);

  const selectRadio = itemsPrivacy.find(
    (element) => element.value === chooseRadio,
  );

  const handleImageChange = (e) => {
    const files = e.target.files;
    const newFilesArray = Array.from(files);
    setSelectedImages(newFilesArray);
  };

  useEffect(() => {
    const processImages = async () => {
      const previewResults = [];
      let id = 0;
      for (const file of selectedImages) {
        console.log(file.value);
        try {
          const result = await convertFileToDataURL(file);
          const newPreviewItem = {
            file,
            id: preview.length + id++,
            type: file.type,
            description: "",
            srcOrigin: result,
            src: result,
          };
          previewResults.push(newPreviewItem);
        } catch (error) {
          // console.error("Error previewing image:", error);
        }
      }
      setPreview((prevPreviews) => [...prevPreviews, ...previewResults]);
    };
    if (selectedImages.length > 0) {
      processImages();
    }
  }, [selectedImages]);
  if (user === null) return null;
  const updatePreviewItem = (id, updatedProperties) => {
    const updatedPreview = preview.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedProperties }; // Update the item with new properties
      }
      return item; // Return unchanged item if ID doesn't match
    });

    setPreview(updatedPreview); // Update the state with the new array
  };
  // console.log(preview);
  // console.log("selectedFileId", selectedFileId, "imgEdit", imgEdit);
  //
  const nodeHeaderRight = (
    <div style={{ display: "flex", gap: "10px" }}>
      {activeMenu !== "main" ? (
        <Button
          onClick={() => {
            changeActiveMenu("main"), setChooseRadio(valueRadio);
          }}
        >
          Done!
        </Button>
      ) : (
        <Button
          onClick={async () => {
            const postId = generatePublicId(20);
            const imageUrl = [];

            for (const file of preview) {
              if (file.type.includes("video")) {
                const response = await uploadFiles(
                  file.file,
                  "up_post",
                  `${postId}_media${file.id}`,
                );
                const data = await response.json();
                imageUrl.push({ url: data.url, mediaType: file.type });
                continue;
              }

              const response = await uploadFiles(
                file.src,
                "up_post",
                `${postId}_media${file.id}`,
              );
              const data = await response.json();
              imageUrl.push({ url: data.url, mediaType: file.type });
            }
            await createPost({
              text,
              visibility: valueRadio,
              imageUrl,
              postId,
            }).then(() => {
              setIsModalOpen(false);
            });
            // await updatePost({ postId, imageUrl }).then((data) => {
            //   console.log(data);
            // });
            // console.log(imageUrl);
          }}
        >
          Post
        </Button>
      )}
    </div>
  );
  const fileInputRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const handleEmojiSelect = (emoji) => {
    setText(text + emoji.native);
  };
  const { width } = useViewport();

  return (
    <Dialog
      title="Create Post"
      maxWidth={activeMenu === "editfile" ? "700px" : "600px"}
      onClose={() => setIsModalOpen(false)}
      isOpen={isModalOpen}
      nodeHeaderRight={nodeHeaderRight}
      nodeHeaderLeft={
        <IconButton
          onClick={() => {
            if (activeMenu === "main") {
              setIsModalOpen(false);
              setSelectedFileId(null);
              setPreview([]);
              setText("");
            } else {
              setActiveMenu("main");
            }
          }}
          size={30}
        >
          {activeMenu === "main" ? (
            <IoMdClose size={30} />
          ) : (
            <IoMdArrowBack size={30} />
          )}
        </IconButton>
      }
      nodeFooter={
        activeMenu === "main" && (
          <div className="create-post__upload-item">
            <IconButton onClick={() => fileInputRef.current.click()}>
              <LuImagePlus size={25} />
            </IconButton>
            <div>
              <IconButton onClick={() => setShowEmoji(!showEmoji)}>
                <MdOutlineAddReaction size={25} />
              </IconButton>
              <div
                style={{
                  position: "fixed",
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
            <input
              style={{
                display: "none",
              }}
              ref={fileInputRef}
              multiple
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
              type="file"
            />
          </div>
        )
      }
    >
      <div style={{ overflow: "hidden" }}>
        <CSSTransition
          in={activeMenu === "main"}
          timeout={500}
          unmountOnExit
          classNames="menu-primary"
        >
          <div className="create-post-container">
            <div className="create-post-container__header">
              <Avatar src={user.avatar_url} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p>{user.name}</p>
                <div
                  style={{
                    cursor: "pointer",
                    background: "var(--color-gray-200)",
                    paddingInline: "7px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                  }}
                  onClick={() => {
                    changeActiveMenu("custom");
                  }}
                >
                  {selectRadio.icon}
                  {selectRadio.label}
                </div>
              </div>
            </div>
            <InputMultiline
              size={"superlarge"}
              onChange={onTextChange}
              value={text}
              autoInserRow={true}
              label="What is happening?!"
              variant={"placeholder"}
              rows={2}
              noBorder
              noOutline
            />
            <div
              style={{
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  zIndex: "4000",
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                  paddingInline: "10px",
                }}
              >
                <Button
                  startIcon={<MdEdit size={25} />}
                  onClick={() => changeActiveMenu("editfile")}
                >
                  Edit
                </Button>
                <IconButton
                  onClick={() => {
                    setPreview([]);
                  }}
                  backgroundColor="var(--color-gray-200)"
                >
                  <MdClose size={30} />
                </IconButton>
              </div>
              <MediaViewer media={preview} />
            </div>
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeMenu === "custom"}
          timeout={500}
          unmountOnExit
          classNames="menu-secondary"
        >
          <div className="create-post-container">
            <p>
              Who can see your post?
              <br />
              Your post will appear in Feed, on your profile and in search
              results. Your default audience is set to Public, but you can
              change the audience of this specific post.
            </p>
            {/*TODO: create inputCustom*/}
            {/* <InputRadio */}
            {/*   name="privacy" */}
            {/*   items={itemsPrivacy} */}
            {/*   value={valueRadio} */}
            {/*   onChange={handleRadioChange} */}
            {/* /> */}
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeMenu === "editfile"}
          timeout={500}
          unmountOnExit
          classNames="menu-secondary"
        >
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              gap: "5px",
              backgroundColor: "#E4E6EB",
              postion: "relative",
            }}
          >
            {preview.map((media, index) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  margin: "10px auto",
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    backgroundColor: "#eeeeee",
                    // maxHeight: "100px",
                    width: "auto",
                    margin: "auto",
                  }}
                >
                  {media.type.includes("image") ? (
                    <img
                      style={{
                        display: "block",
                        width: "300px",
                        objectFit: "contain",
                        height: "180px",
                      }}
                      key={media.id}
                      src={media.src}
                      alt="preview"
                      className="create-post-container__preview"
                    />
                  ) : (
                    <video
                      controls="controls"
                      preload="metadata"
                      style={{
                        display: "block",
                        width: "300px",
                        objectFit: "contain",
                        height: "180px",
                      }}
                      key={media.id}
                      alt="preview"
                      className="create-post-container__preview"
                    >
                      <source src={media.src} type="video/mp4" />
                    </video>
                  )}
                </div>
                <InputMultiline
                  label="Description"
                  variant="filled"
                  rows={2}
                  value={media.description}
                  onChange={(e) => {
                    const updatedProperties = {
                      description: e.target.value,
                    };
                    updatePreviewItem(media.id, updatedProperties);
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "10px",
                    left: "10px",
                    right: "10px",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedFileId(media.id);
                      // setImgEdit(img);
                      setModalCropper(true);
                    }}
                  >
                    Edit
                  </Button>

                  <IconButton
                    size={20}
                    onClick={() => {
                      setPreview((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <MdClose size={20} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </CSSTransition>

        <CropperImage
          src={imgEdit || ""}
          cropperRef={cropperRef}
          isModalOpen={modalCropper}
          selectedFileId={selectedFileId}
          setSelectedFileId={setSelectedFileId}
          setIsModalOpen={setModalCropper}
          imgEdit={imgEdit}
          preview={preview}
          setPreview={setPreview}
        />
      </div>
    </Dialog>
  );
};

export default CreatePost;
