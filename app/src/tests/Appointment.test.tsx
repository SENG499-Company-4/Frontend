import classData from 'data/clean.json';
import { parseCalendarTeacher, parseCalendarCourse, getTeacherById } from 'utils/utils';

test('Testing getTeacherByID', () => {
  const expected = parseCalendarTeacher(JSON.parse(JSON.stringify(classData.slice(0, 1))))[0];
  const courseData = parseCalendarCourse(JSON.parse(JSON.stringify(classData.slice(0, 1))))[0];
  const res = getTeacherById(courseData.teacherId);

  expect(res.id).toEqual(expected.id);
});

export {};
