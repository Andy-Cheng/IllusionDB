import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Layout } from 'antd';
import TagTree from './components/TagTree';
import Tags from './components/Tags';
import IllusionItems from './components/IllusionItems';
import {serverIP, getTagTree, findIllusionWithTags} from './Util';
import './App.css';

const { Header, Footer, Sider, Content } = Layout;

const IllusionIcon = ({tabUrl}) => {

  return (
      <img src={`http://${serverIP}${tabUrl}`} alt="" width="22" />
   );
}

const ParseTreeData = (treeData, isElement) => {

  let parsedData = [];
  if(isElement)
  {
    treeData.forEach(element => {
      let newElement = {};
      newElement.title = element.name.replace('&', '/').replace('&', '/');
      newElement.key = element._id;
      newElement.icon = <IllusionIcon tabUrl={element.iconURL}/>;
      newElement.level = element.level;
      if (element.subelements) {
        newElement.children = ParseTreeData(element.subelements);
      }
      else {
  
      }
      parsedData.push(newElement);
  
    });
  }
  else{
    treeData.forEach(element => {
      let newElement = {};
      newElement.title = element.name.replace('&', '/').replace('&', '/');
      newElement.key = element._id;
      newElement.icon = <IllusionIcon tabUrl={element.iconURL}/>;
      newElement.level = element.level;
      if (element.subeffects) {
        newElement.children = ParseTreeData(element.subeffects);
      }
      else {
  
      }
      parsedData.push(newElement);
  
    });
  }
  return parsedData;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { tagType: "categories", categoryTreeData: [], effectTreeData: [], selectedCategoryTags:[], selectedEffectTags: [], illusionElementItems: [], illusionEffectItems: [] };
  }


  handleTagCategoryChange = (tagType) =>{
    this.setState((prevState)=>{
      if(prevState.tagType == tagType)
      {
        return prevState;
      }
      // fetch new tag tree and update
      this.setState({tagType});
    });

  }

  handleTagChange = (selectedTags) =>{
    if(this.state.tagType == "categories")
    {
      this.setState({selectedCategoryTags: selectedTags});
      let tagsSearched = {};
      selectedTags.forEach(e=>{
        if(tagsSearched[e.level])
        {
          tagsSearched[e.level] += `&${e.id}`;
        }
        else
        {
          tagsSearched[e.level] = e.id;
          
        }
      });
      console.log(tagsSearched);
      let tagSearchedArray = [];
      for(const [key, val] of Object.entries(tagsSearched))
      {
        tagSearchedArray.push(val);

      }
      console.log(tagSearchedArray);
      findIllusionWithTags("elements", tagSearchedArray).
      then((result)=>{
        console.log(result);
        this.setState({illusionElementItems: result.data});
      })
    }
    else
    {
      this.setState({selectedEffectTags: selectedTags});
      let tagsSearched = {};
      selectedTags.forEach(e=>{
        if(tagsSearched[e.level])
        {
          tagsSearched[e.level] += `&${e.id}`;
        }
        else
        {
          tagsSearched[e.level] = e.id;
          
        }
      });
      console.log(tagsSearched);
      let tagSearchedArray = [];
      for(const [key, val] of Object.entries(tagsSearched))
      {
        tagSearchedArray.push(val);

      }
      console.log(tagSearchedArray);
      findIllusionWithTags("effects", tagSearchedArray).
      then((result)=>{
        console.log(result);
        this.setState({illusionEffectItems: result.data});
      })
    }
  }

  componentDidMount()
  {
    Promise.all([getTagTree("elements"), getTagTree("effects")]).
    then((results)=>{
      console.log(results);
      this.setState({categoryTreeData: ParseTreeData(results[0].data, true), effectTreeData: ParseTreeData(results[1].data, false)},);
    });

  }

  render() {
    return (
        <Layout style={{ backgroundColor: "#fff" }}>
          <Sider
            style={{
              height: '100vh',
              position: 'fixed',
              backgroundColor: "#fff",
              left: 0,
              overflow: "scroll"

            }}
            width="350px"
          >
            <TagTree handleTagCategoryChange={this.handleTagCategoryChange} handleTagChange={this.handleTagChange} tagType={this.state.tagType} categoryData={this.state.categoryTreeData} effectData={this.state.effectTreeData}/>
          </Sider>
          <Layout className="site-layout" style={{ marginLeft: 350, }}>
            <Header className="site-layout-background" style={{ position: "fixed", zIndex: 1, overflow: "scroll", height: "100px", width: "100%", }}>

              <Tags tagType={this.state.tagType} selectedTags={(this.state.tagType=="categories")? this.state.selectedCategoryTags:this.state.selectedEffectTags}/>
            </Header>
            <Content>
              <div className="site-layout-background" style={{ paddingTop: "100px", minHeight: "94vh" }}>
                <IllusionItems selectedTags={(this.state.tagType == "categories")? this.state.selectedCategoryTags:this.state.selectedEffectTags} illusionItems={(this.state.tagType == "categories")? this.state.illusionElementItems:this.state.illusionEffectItems} />
              </div>
            </Content>
            <Footer style={{  textAlign: 'center', backgroundColor: "#fff" }}>Illusion Database @NTU HCI Lab</Footer>
          </Layout>
        </Layout>
    );
  }
}

export default App;