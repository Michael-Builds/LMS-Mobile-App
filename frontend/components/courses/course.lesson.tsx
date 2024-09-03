import React, { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useFonts } from "expo-font"
import { Entypo, Feather } from "@expo/vector-icons"
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_500Medium,
} from "@expo-google-fonts/nunito"

interface CourseLessonProps {
  courseDetails: CoursesType
}

export default function CourseLesson({ courseDetails }: CourseLessonProps) {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>()
  )

  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_500Medium,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  const videoSections: string[] = [
    ...new Set<string>(
      courseDetails.courseData.map((item: CourseDataType) => item.videoSection)
    ),
  ]

  const toggleSection = (section: string) => {
    setVisibleSections((prevSections) => {
      const updatedSections = new Set(prevSections)
      if (updatedSections.has(section)) {
        updatedSections.delete(section)
      } else {
        updatedSections.add(section)
      }
      return updatedSections
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        {videoSections.map((section, index) => {
          const isSectionVisible = visibleSections.has(section)

          const sectionVideos = courseDetails.courseData.filter(
            (item) => item.videoSection === section
          )

          return (
            <View key={index}>
              <View
                style={[
                  styles.sectionHeader,
                  {
                    borderBottomWidth:
                      index === videoSections.length - 1 ? 0 : 0.2,
                  },
                ]}
              >
                <Text style={styles.sectionTitle}>{section}</Text>
                <TouchableOpacity onPress={() => toggleSection(section)}>
                  <Entypo
                    name={isSectionVisible ? "chevron-up" : "chevron-down"}
                    size={22}
                    color="#1571ba"
                  />
                </TouchableOpacity>
              </View>
              {isSectionVisible &&
                sectionVideos.map((video, index) => (
                  <View key={index} style={styles.videoContainer}>
                    <View style={styles.videoContent}>
                      <View style={styles.videoInfo}>
                        <Feather name="video" size={20} color="#8a8a8a" />
                        <Text style={styles.videoTitle}>{video.title}</Text>
                      </View>
                      <Text style={styles.videoLength}>
                        {video.videoLength}{" "}
                        {video.videoLength > 60 ? "hours" : "minutes"}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    marginBottom: 15,
  },
  sectionContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E1E2E5",
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "#999",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    fontWeight: "600",
  },
  videoContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E1E2E5",
    marginVertical: 5,
  },
  videoContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E2E5",
  },
  videoInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  videoTitle: {
    marginLeft: 8,
    fontSize: 16,
    color: "#525258",
    fontFamily: "Nunito_500Medium",
  },
  videoLength: {
    marginRight: 6,
    color: "#818181",
    fontFamily: "Nunito_400Regular",
  },
})
