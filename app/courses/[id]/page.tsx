if (!course) {
  return <div>Course not found</div>;
}

const { error } = await supabase.from("enrollments").insert({
  user_id: user.id,
  course_id: course.id,
  status: "enrolled",
}