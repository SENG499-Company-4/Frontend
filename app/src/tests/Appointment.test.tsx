import classData from 'data/clean.json';
import { parseCalendarJSON } from 'utils/utils';
import { getClassById } from 'components/organisms/Appointment';

test('Testing getClassByID', () => {
  const expected = parseCalendarJSON(JSON.parse(JSON.stringify(classData.slice(0, 1))))[0];
  const res = getClassById(expected.courseId);

  expect(res).toEqual(expected);
})

export { };