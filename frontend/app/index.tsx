import Loader from "@/components/loaders/loader"
import useUser from "@/hooks/auth/useUser"
import { Redirect } from "expo-router"
import React from "react"

export default function MainIndex() {
  const { user, loading } = useUser()

  if (loading) {
    return <Loader />
  }

  return <Redirect href={!user ? "/(routes)/onboarding" : "/(tabs)"} />
}
