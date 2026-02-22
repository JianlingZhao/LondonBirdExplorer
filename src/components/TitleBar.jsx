function TitleBar() {

  return (

    <div style={{
      width: '100%',
      height: '60px',
      backgroundColor: '#2A5D3F',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      zIndex: 1000,
      position: 'relative'
    }}>

      <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
        London Bird Observation Explorer
      </h2>

      
      <div style={{ marginLeft: 'auto', fontSize: '0.9rem', opacity: 0.8 }}>
        v1.0.0
      </div>

    </div>
    
  );
}
export default TitleBar;