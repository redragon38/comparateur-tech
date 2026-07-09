import DecisionPage from '../components/DecisionPage';
import { getDecisionPageStaticProps } from '../lib/decision-page-props';

export async function getStaticProps() {
  return getDecisionPageStaticProps('chatgpt-vs-claude');
}

export default DecisionPage;
