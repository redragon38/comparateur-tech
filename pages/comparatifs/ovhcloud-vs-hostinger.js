import DecisionPage from '../../components/DecisionPage';
import { getDecisionPageStaticProps } from '../../lib/decision-page-props';

export async function getStaticProps() {
  return getDecisionPageStaticProps('ovhcloud-vs-hostinger');
}

export default DecisionPage;
