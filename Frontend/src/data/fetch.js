import { successToast } from "../components/Toasts";

export const loadPosts = async (search) => {
  const urlBase = "https://3580-110-39-11-3.ngrok-free.app/blogPosts";
  const urlSearch = search && `?title=${search}`;
  const res = await fetch(urlBase + urlSearch, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export const loadComments = async (id) => {
  const res = await fetch(`https://3580-110-39-11-3.ngrok-free.app/blogPosts/${id}/comments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export const deleteComment = async (id, commentId) => {
  const res = await fetch(
    `https://3580-110-39-11-3.ngrok-free.app/blogPosts/${id}/comment/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  const data = await res.json();
  return data;
};

export const loadSinglePost = async (paramsId) => {
  console.log(paramsId);
  const res = await fetch(`https://3580-110-39-11-3.ngrok-free.app/blogPosts/${paramsId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export const newPost = async (formValue, cover) => {
  const formData = new FormData();
  formData.append("cover", cover);
  formData.append("category", formValue.category);
  formData.append("title", formValue.title);
  formData.append("readTime", JSON.stringify(formValue.readTime));
  formData.append("author", formValue.author);
  formData.append("content", formValue.content);
  const res = await fetch("https://3580-110-39-11-3.ngrok-free.app/blogPosts", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  return data;
};

export const updatePost = async (id, formValue, cover) => {
  const formData = new FormData();
  // if (cover) formData.append("cover", cover);
  formData.append("category", formValue.category);
  formData.append("title", formValue.title);
  formData.append("readTime", JSON.stringify(formValue.readTime));
  formData.append("author", formValue.author);
  formData.append("content", formValue.content);
  const res = await fetch(`https://3580-110-39-11-3.ngrok-free.app/blogPosts/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    method: "PUT",
    body: formData,
  });
  const data = await res.json();

  if (cover) {
    const formData = new FormData();
    if (cover) formData.append("cover", cover);
    const res = await fetch(`https://3580-110-39-11-3.ngrok-free.app/blogPosts/${id}/cover`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "PATCH",
      body: formData,
    });
    const data = await res.json();
    return data;
  }

  return data;
};

export const getPost = async (id) => {
  const res = await fetch(`https://3580-110-39-11-3.ngrok-free.app/blogPosts/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    method: "GET",
  });
  const data = await res.json();

  return data;
};

export const login = async (formValue) => {
  try {
    const res = await fetch("https://3580-110-39-11-3.ngrok-free.app/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formValue),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const errorData = await res.json();
      return { error: errorData.message || "Errore di login" };
    }
  } catch (error) {
    return { error: "Errore, riporva più tardi" };
  }
};

export const me = async () => {
  const res = await fetch("https://3580-110-39-11-3.ngrok-free.app/auth/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) {
    throw new Error(res.status);
  }
  const data = await res.json();
  return data;
};

export const register = async (regFormValue, avatar) => {
  const formData = new FormData();
  formData.append("avatar", avatar);
  formData.append("first_name", regFormValue.first_name);
  formData.append("last_name", regFormValue.last_name);
  formData.append("date_of_birth", regFormValue.date_of_birth);
  formData.append("email", regFormValue.email);
  formData.append("password", regFormValue.password);

  try {
    const res = await fetch("https://3580-110-39-11-3.ngrok-free.app/auth/register", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    successToast("User Created Successfully!");
    return data;
  } catch (error) {
    console.log(error);
    successToast(error?.message ?? error);
  }
};

export const newComment = async (id, formValue) => {
  const res = await fetch(`https://3580-110-39-11-3.ngrok-free.app/blogPosts/${id}/comments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(formValue),
  });
  const data = await res.json();
  return data;
};

export const updateComment = async (id, formValue, commentId) => {
  const res = await fetch(
    `https://3580-110-39-11-3.ngrok-free.app/blogPosts/${id}/comment/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(formValue),
    }
  );
  const data = await res.json();
  return data;
};

export const deletePost = async (postId) => {
  try {
    const res = await fetch(`https://3580-110-39-11-3.ngrok-free.app/blogPosts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    if (res.ok) {
      console.log(`Post con ID ${postId} eliminato con successo.`);
    } else {
      const errorData = await res.json();
      console.error(`Errore: ${errorData.message}`);
    }
  } catch (error) {
    console.error(`Errore durante l'eliminazione del post: ${error.message}`);
  }
};

export const updateUserAvatar = async (authorId, avatar) => {
  const formData = new FormData();
  formData.append("avatar", avatar);
  const res = await fetch(`https://3580-110-39-11-3.ngrok-free.app/authors/${authorId}/avatar`, {
    method: "PATCH",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};
