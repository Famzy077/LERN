import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/course.service";
import { CreateCourseDTO } from "../types/course.types";

export const useCourses = (search?: string) => {
  return useQuery({
    queryKey: ["courses", search],
    queryFn: () => courseService.getAll({ search }),
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => courseService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseDTO) => courseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
