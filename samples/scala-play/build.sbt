enablePlugins(LauncherJarPlugin)

name := "cloudpit-scala-play"

scalaSource in Compile := baseDirectory.value / "app"

resourceDirectory in Compile := baseDirectory.value / "app"

scalaVersion := "2.13.5"

libraryDependencies := Seq(
  "com.typesafe.play" %% "play-akka-http-server" % "2.8.7",
  "org.slf4j" % "slf4j-simple" % "1.7.21"
)

scalacOptions ++= Seq(
  "-unchecked",
  "-deprecation",
  "-explaintypes",
  "-feature",
  "-Xcheckinit",
  "-Xfatal-warnings",
  "-Xlint:adapted-args",
  "-Xlint:constant",
  "-Xlint:delayedinit-select",
  "-Xlint:doc-detached",
  "-Xlint:inaccessible",
  "-Xlint:infer-any",
  "-Xlint:nullary-unit",
  "-Xlint:option-implicit",
  "-Xlint:package-object-classes",
  "-Xlint:poly-implicit-overload",
  "-Xlint:private-shadow",
  "-Xlint:stars-align",
  "-Xlint:type-parameter-shadow",
  "-Ywarn-dead-code",
  "-Ywarn-extra-implicit",
  "-Ywarn-numeric-widen",
  "-Ywarn-unused:implicits",
  "-Ywarn-unused:locals",
  "-Ywarn-unused:params",
  "-Ywarn-unused:patvars",
  "-Ywarn-unused:privates",
)

Global / cancelable := false

publishArtifact in (Compile, packageDoc) := false

sources in (Compile,doc) := Seq.empty