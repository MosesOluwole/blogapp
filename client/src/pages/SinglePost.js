import React, { useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardImage,
  MDBContainer,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { getPost } from "../redux/features/postSlice";
import Disqus from "disqus-react";

//import RelatedTours from "../components/RelatedTours";
// import DisqusThread from "../components/DisqusThread";
const IMGAE_PATH = "/images/";
const SinglePost = () => {
  const dispatch = useDispatch();
  const { post } = useSelector((state) => ({ ...state.post }));
  const { id } = useParams();
  const navigate = useNavigate();
  const tags = post?.tags;

  useEffect(() => {
    // tags && dispatch(getRelatedTours(tags));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  useEffect(() => {
    if (id) {
      dispatch(getPost(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const disqusShortname = "blog-um3sqn9tsg";
  const disqusConfig = {
    url: "http://localhost:3000",
    identifier: id,
    title: post.title,
  };

  return (
    <>
      <MDBContainer>
        <MDBCard className="mb-3 mt-2">
          <MDBCardImage
            position="top"
            style={{ width: "100%", maxHeight: "600px" }}
            src={IMGAE_PATH + post.imageFile}
            alt={post.title}
          />
          <MDBCardBody>
            <MDBBtn
              tag="a"
              color="none"
              style={{ float: "left", color: "#000" }}
              onClick={() => navigate("/")}
            >
              <MDBIcon
                fas
                size="lg"
                icon="long-arrow-alt-left"
                style={{ float: "left" }}
              />
            </MDBBtn>
            <h3>{post.title}</h3>
            <span>
              <p className="text-start tourName">Created By: {post.name}</p>
            </span>
            <div style={{ float: "left" }}>
              <span className="text-start">
                {post && post.tags && post.tags.map((item) => `#${item} `)}
              </span>
            </div>
            <br />
            <MDBCardText className="text-start mt-2">
              <MDBIcon
                style={{ float: "left", margin: "5px" }}
                far
                icon="calendar-alt"
                size="lg"
              />
              <small className="text-muted">
                {moment(post.createdAt).fromNow()}
              </small>
            </MDBCardText>
            <MDBCardText className="lead mb-0 text-start">
              {post.description}
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
        <Disqus.DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </MDBContainer>
    </>
  );
};

export default SinglePost;
