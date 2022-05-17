import React, { useState, useEffect, useCallback } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBValidation,
  MDBBtn,
  MDBInput,
  MDBFile,
  MDBTextArea,
} from "mdb-react-ui-kit";

import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../redux/features/postSlice";
import { isAnyOf } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  description: "",
  tags: [],
  imageFile: {},
};

const AddEditPost = () => {
  const [postData, setPostData] = useState(initialState);
  //const [tagErrMsg, setTagErrMsg] = useState(null);
  const { error, userPosts } = useSelector((state) => ({
    ...state.post,
  }));
  const { user } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { title, description, tags } = postData;
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const singlePost = userPosts.find(({ id }) => id);
      setPostData({ ...singlePost });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);

    if (title && description && tags) {
      const updatedPostData = {
        ...postData,
        creator: user?.result.id,
        name: user?.result.firstname,
      };
      console.log(id);
      if (id == null) {
        dispatch(createPost({ updatedPostData, navigate, toast }));
      } else {
        dispatch(updatePost({ id, updatedPostData, toast, navigate }));
      }
      handleClear();
    }
  };
  console.log(id);
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };

  const handleClear = () => {
    setPostData({ title: "", description: "", tags: [] });
  };
  const handlefile = useCallback(
    (e) => {
      console.log(e);
      setPostData({ ...postData, imageFile: e.target.files[0] });
      return e;
    },
    [postData]
  );
  return (
    <div
      style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "450px",
        alignContent: "center",
        marginTop: "120px",
      }}
      className="container"
    >
      <MDBCard alignment="center">
        <h5>{id ? "Update Post" : "Add Post"}</h5>
        <MDBCardBody>
          <MDBValidation onSubmit={handleSubmit} className="row g-3" noValidate>
            <div className="col-md-12">
              <MDBInput
                placeholder="Enter Title"
                type="text"
                value={title || ""}
                name="title"
                onChange={onInputChange}
                className="form-control"
                required
                //invalid
                validation="Please provide title"
              />
            </div>
            <div className="col-md-12">
              <MDBTextArea
                placeholder="Enter Description"
                type="textarea"
                value={description}
                name="description"
                onChange={onInputChange}
                className="form-control"
                required
                // invalid
                rows={4}
                validation="Please provide description"
              />
            </div>

            <div className="d-flex justify-content-start">
              <MDBFile name="imageFile" id="customFile" onChange={handlefile} />
            </div>
            <div className="col-12">
              <MDBBtn style={{ width: "100%" }}>
                {id ? "Update" : "Submit"}
              </MDBBtn>
              <MDBBtn
                style={{ width: "100%" }}
                className="mt-2"
                color="danger"
                onClick={handleClear}
              >
                Clear
              </MDBBtn>
            </div>
          </MDBValidation>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default AddEditPost;
