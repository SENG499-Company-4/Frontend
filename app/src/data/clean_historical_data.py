from email.mime import base
import json
import datetime
import random

def build_course_id(entry):
    term_string = {
        "01": "SPRING",
        "05": "SUMMER",
        "09": "FALL"
    }
    term = term_string[entry['term'][4:]]
    return {
        "subject": entry['subject'],
        "code": entry['courseNumber'],
        "term": term,
    }


def build_meeting_times(entry):
    meetingTimeObject = entry["meetingsFaculty"][0]["meetingTime"].copy()
    startTime = meetingTimeObject["beginTime"]
    endTime = meetingTimeObject["endTime"]
    baseMeetingTime = {
        "Day": "",
        "StartTime": datetime.datetime.strptime(startTime, "%H%M").time(),
        "EndTime": datetime.datetime.strptime(endTime, "%H%M").time(),
    }
    days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    meetingTimes = []
    for day in days:
        if meetingTimeObject[day]:
            meetingTime = baseMeetingTime.copy()
            meetingTime["Day"] = day.upper()
            meetingTimes.append(meetingTime)
    return meetingTimes


def build_user(entry):
    username = entry["faculty"][0]["emailAddress"].split("@")[0]
    coursePreference = {
        "id": build_course_id(entry),
        "preference": random.randrange(120, 195)
    }
    return [{
        "id": random.randrange(10000),
        "username": username,
        "password": None,
        "role": "USER",
        "preferences": coursePreference,
        "active": True
    }]

def build_course(entry):
    courseId = build_course_id(entry)
    startDate = datetime.datetime.strptime(entry["meetingsFaculty"][0]["meetingTime"]["startDate"], '%b %d, %Y').date()
    endDate = datetime.datetime.strptime(entry["meetingsFaculty"][0]["meetingTime"]["endDate"], '%b %d, %Y').date()
    meetingTimes = build_meeting_times(entry)
    professors = build_user(entry)
    return {
        "CourseID": courseId,
        "hoursPerWeek": entry["meetingsFaculty"][0]["meetingTime"]["hoursWeek"],
        "capacity": entry["maximumEnrollment"],
        "professors": professors,
        "startDate": startDate,
        "endDate": endDate,
        "meetingTimes": meetingTimes
    }


f = open('base.json')
data = json.load(f)
courses = []
for entry in data:
    if entry:
        try:
            if "2022" in entry['term']:
                if (entry['subject'] == "SENG" or entry['subject'] == "CSC" or entry['subject'] == "ECE"):
                    if "A" in entry['sequenceNumber']:
                        course = build_course(entry)
                        courses.append(course)
        except Exception as e: 
            print(e)
with open('clean.json', 'w') as f:
    json.dump(courses, f, default=str)