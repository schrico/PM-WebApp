export default function MyProjectsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        My Projects
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Here you’ll see your unclaimed and in-progress translation projects.
      </p>
      {/* Later: <MyProjects /> from components/pages/MyProjects */}
    </div>
  );
}
