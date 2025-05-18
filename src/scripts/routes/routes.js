import Home from '../view/StoryListView.js';
import AddStory from '../view/AddStoryView.js';
import NotFound from '../view/NotFoundView.js';
import Login from '../view/LoginView.js';
import Register from '../view/RegisterView.js';
import Saved from '../view/SavedStoryView.js';

const routes = {
  '/': Home,
  '/add': AddStory,
  '/login': Login,
  '/register': Register,
  '/saved': Saved,
};

const router = async () => {
  const path = location.hash.slice(1).toLowerCase() || '/';
  const view = routes[path] || NotFound;
  const app = document.querySelector('#app');

  const renderView = async () => {
    app.innerHTML = await view.render();
    await view.afterRender?.();
  };

  if (document.startViewTransition) {
    document.startViewTransition(renderView);
  } else {
    await renderView();
  }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export default router;
