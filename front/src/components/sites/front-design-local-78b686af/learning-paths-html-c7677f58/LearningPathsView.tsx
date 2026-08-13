export function LearningPathsView() {
  return (
    <section className="view" id="pageLearningPaths">
      <div className="page-head">
        <h2>学习路径</h2>
        <p>第一次来不知道学什么？选一条路线，按顺序完成每一课。</p>
      </div>
      <nav
        className="path-tabs"
        id="pathTabs"
        role="tablist"
        aria-label="学习路线"
      />
      <div id="pathPanels" />
    </section>
  );
}
