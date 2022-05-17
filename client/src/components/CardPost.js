import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBCardGroup,
  MDBBtn,
  MDBIcon,
  MDBTooltip,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { likeTour } from "../redux/features/postSlice";
const IMGAE_PATH = "/images/";
const CardTour = ({
  imageFile,
  description,
  title,
  tags,
  id,
  name,
  //   likes,
}) => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const userId = user?.result?.id;

  const dispatch = useDispatch();
  const excerpt = (str) => {
    if (str.length > 45) {
      str = str.substring(0, 45) + " ...";
    }
    return str;
  };

  //   const Likes = () => {
  //     if (likes.length > 0) {
  //       return likes.find((like) => like === userId) ? (
  //         <>
  //           <MDBIcon fas icon="thumbs-up" />
  //           &nbsp;
  //           {likes.length > 2 ? (
  //             <MDBTooltip
  //               tag="a"
  //               title={`You and ${likes.length - 1} other people likes`}
  //             >
  //               {likes.length} Likes
  //             </MDBTooltip>
  //           ) : (
  //             `${likes.length} Like${likes.length > 1 ? "s" : ""}`
  //           )}
  //         </>
  //       ) : (
  //         <>
  //           <MDBIcon far icon="thumbs-up" />
  //           &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
  //         </>
  //       );
  //     }
  //     return (
  //       <>
  //         <MDBIcon far icon="thumbs-up" />
  //         &nbsp;Like
  //       </>
  //     );
  //   };

  const handleLike = () => {
    // dispatch(likeTour({ _id }));
  };

  return (
    <MDBCardGroup>
      <MDBCard className="h-100 mt-2 d-sm-flex" style={{ maxWidth: "20rem" }}>
        <MDBCardImage
          src={IMGAE_PATH + imageFile}
          alt={title}
          position="top"
          style={{ maxWidth: "100%", height: "180px" }}
        />
        <div className="top-left">{name}</div>
        {/* <span className="text-start tag-card">
          {tags.map(
            (item) =>
              `#${item}`
              // <Link to={`/tours/tag/${tag}`}> #{tag}</Link>
          )}
        </span> */}
        <MDBCardBody>
          <MDBCardTitle className="text-start">{title}</MDBCardTitle>
          <MDBCardText className="text-start">
            {excerpt(description)}
            <Link to={`/post/${id}`}>Read More</Link>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBCardGroup>
  );
};

export default CardTour;
