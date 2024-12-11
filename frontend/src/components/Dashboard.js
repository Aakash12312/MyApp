/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Visibility,
  Share as ShareIcon,
  Facebook,
  Instagram,
  LinkedIn,
  WhatsApp,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const StyledAppBar = styled(AppBar)({
  background: "linear-gradient(45deg, #005082, #2e8bc0)",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
});

const PostCard = styled(Card)({
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
  },
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Post One",
      content: "Lorem ipsusdfghjkl;lkjhgfdsasdfghjklkjhgfdsdfghjklkjhgfdsdfghjkl;lkjhgdsdfghjl;lkjhgfdvvvvvvvvvvvvvvm...",
      status: "Published",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Post Two",
      content: "Lorem ipsum...",
      status: "Draft",
      createdAt: new Date(),
    },
  ]);
  const [editPost, setEditPost] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); 
  const [currentPost, setCurrentPost] = useState(null); 

  // Handle View
  const handleView = (post) => {
    navigate(`/posts/${post.id}`, { state: { post } });
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  // Handle Edit
  const handleEdit = (post) => {
    setEditPost(post);
  };

  // Save Post
  const handleSave = () => {
    setPosts(posts.map((post) => (post.id === editPost.id ? editPost : post)));
    setEditPost(null);
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPost({ ...editPost, [name]: value });
  };

  // Copy content and open Share Menu
  const handleShareClick = (event, post) => {
    const contentToCopy = `Check out this post: "${post.title}"\n\n${post.content}\n\nCheckout for more content at https://yourblog.com;`
    navigator.clipboard
      .writeText(contentToCopy)
      .then(() => alert("Post content copied to clipboard!"))
      .catch((err) => console.error("Failed to copy to clipboard", err));

    setAnchorEl(event.currentTarget); // Open the Share Menu
    setCurrentPost(post); // Set the current post for sharing
  };

  // Close Share Menu
  const handleShareClose = () => {
    setAnchorEl(null);
  };

  // Share to different platforms
  const shareTo = (platform) => {
    if (!currentPost) return;

    const { title, content } = currentPost;
    const url = "https://yourblog.com"; // Replace with your blog's URL
    const message = `Check out this post: "${title}"\n\n${content}\n\nCheckout for more content at ${url}`;

    let shareUrl = "";

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}&quote=${encodeURIComponent(message)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
          content
        )}`;
        break;
      case "instagram":
        alert(
          "Content copied to clipboard. You can paste it into your Instagram chat or post."
        );
        shareUrl = `https://www.instagram.com/`;
        break;
      default:
        alert("Platform not supported!");
        return;
    }

    window.open(shareUrl, "_blank"); // Open the sharing URL in a new tab
    handleShareClose(); // Close the menu
  };

  return (
    <>
      <StyledAppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}
          >
            THOUGHTLY
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate("/registration")}>
            Registration
          </Button>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button color="inherit" onClick={() => navigate("/about-us")}>
            About Us
          </Button>
          <Button color="inherit" onClick={() => navigate("/contact-us")}>
            Contact Us
          </Button>
        </Toolbar>
      </StyledAppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          All Posts
        </Typography>
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="#003c64">
                    {post.title || "Untitled"}
                    <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                      {post.status}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {post.content.substring(0, 100)}...
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.createdAt.toDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Box>
                    <IconButton
                      size="small"
                      title="View"
                      onClick={() => handleView(post)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Edit"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Delete"
                      onClick={() => handleDelete(post.id)}
                      sx={{ color: "red" }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Share"
                      onClick={(e) => handleShareClick(e, post)}
                    >
                      <ShareIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleShareClose}
                    >
                      <MenuItem onClick={() => shareTo("whatsapp")}>
                        <WhatsApp fontSize="small" sx={{ mr: 1 }} />
                        WhatsApp
                      </MenuItem>
                      <MenuItem onClick={() => shareTo("facebook")}>
                        <Facebook fontSize="small" sx={{ mr: 1 }} />
                        Facebook
                      </MenuItem>
                      <MenuItem onClick={() => shareTo("linkedin")}>
                        <LinkedIn fontSize="small" sx={{ mr: 1 }} />
                        LinkedIn
                      </MenuItem>
                      <MenuItem onClick={() => shareTo("instagram")}>
                        <Instagram fontSize="small" sx={{ mr: 1 }} />
                        Instagram
                      </MenuItem>
                    </Menu>
                  </Box>
                </CardActions>
              </PostCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;