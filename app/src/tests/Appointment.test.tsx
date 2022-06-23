import classData from 'data/clean.json';
import { parseCalendarTeacher, parseCalendarCourse } from 'utils/utils';

import getTeacherById from 'components/organisms/Appointment';

test('Testing getClassByID', () => {
  const expected = parseCalendarTeacher(JSON.parse(JSON.stringify(classData.slice(0, 1))))[0];
  const courseData = parseCalendarCourse(JSON.parse(JSON.stringify(classData.slice(0, 1))))[0];
  const res = getTeacherById(courseData.teacherId);

  expect(res).toEqual(expected.id);
});

export {};
