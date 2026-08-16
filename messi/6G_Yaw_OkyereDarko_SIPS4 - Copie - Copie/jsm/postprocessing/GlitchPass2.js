// import {
// 	DataTexture,
// 	FloatType,
// 	MathUtils,
// 	RGBFormat,
// 	ShaderMaterial,
// 	UniformsUtils
// } from '../../../build/three.module.js';
// import { Pass } from '../postprocessing/Pass.js';
// import { DigitalGlitch } from '../shaders/DigitalGlitch.js';

// var GlitchPass = function ( dt_size ) {

// 	Pass.call( this );

// 	if ( DigitalGlitch === undefined ) console.error( 'THREE.GlitchPass relies on DigitalGlitch' );

// 	var shader = DigitalGlitch;
// 	this.uniforms = UniformsUtils.clone( shader.uniforms );

// 	if ( dt_size == undefined ) dt_size = 64;


// 	this.uniforms[ 'tDisp' ].value = this.generateHeightmap( dt_size );


// 	this.material = new ShaderMaterial( {
// 		uniforms: this.uniforms,
// 		vertexShader: shader.vertexShader,
// 		fragmentShader: shader.fragmentShader
// 	} );

// 	this.fsQuad = new Pass.FullScreenQuad( this.material );

// 	this.goWild = false;
// 	this.curF = 0;
// 	this.generateTrigger();

// };

// GlitchPass.prototype = Object.assign( Object.create( Pass.prototype ), {

// 	constructor: GlitchPass,

// 	render: function ( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

// 		this.uniforms[ 'tDiffuse' ].value = readBuffer.texture;
// 		this.uniforms[ 'seed' ].value = Math.random();//default seeding
// 		this.uniforms[ 'byp' ].value = 0;

// 		if ( this.curF % this.randX == 0 || this.goWild == true ) {

// 			this.uniforms[ 'amount' ].value = Math.random() / 30;
// 			this.uniforms[ 'angle' ].value = MathUtils.randFloat( - Math.PI, Math.PI );
// 			this.uniforms[ 'seed_x' ].value = MathUtils.randFloat( - 1, 1 );
// 			this.uniforms[ 'seed_y' ].value = MathUtils.randFloat( - 1, 1 );
// 			this.uniforms[ 'distortion_x' ].value = MathUtils.randFloat( 0, 1 );
// 			this.uniforms[ 'distortion_y' ].value = MathUtils.randFloat( 0, 1 );
// 			this.curF = 0;
// 			this.generateTrigger();

// 		} else if ( this.curF % this.randX < this.randX / 5 ) {

// 			this.uniforms[ 'amount' ].value = Math.random() / 200;
// 			this.uniforms[ 'angle' ].value = MathUtils.randFloat( - Math.PI, Math.PI );
// 			this.uniforms[ 'distortion_x' ].value = MathUtils.randFloat( 0, 1 );
// 			this.uniforms[ 'distortion_y' ].value = MathUtils.randFloat( 0, 1 );
// 			this.uniforms[ 'seed_x' ].value = MathUtils.randFloat( - 0.1, 0.1 );
// 			this.uniforms[ 'seed_y' ].value = MathUtils.randFloat( - 0.1, 0.1 );

// 		}  else if ( this.goWild == false ) {
        
//             this.uniforms[ 'byp' ].value = 1;
//         }

// 		this.curF +=2;

// 		if ( this.renderToScreen ) {

// 			renderer.setRenderTarget( null );
// 			this.fsQuad.render( renderer );

// 		} else {

// 			renderer.setRenderTarget( writeBuffer );
// 			if ( this.clear ) renderer.clear();
// 			this.fsQuad.render( renderer );

// 		}

// 	},

// 	generateTrigger: function () {

// 		this.randX = MathUtils.randInt( 120, 240 );

// 	},

// 	generateHeightmap: function ( dt_size ) {

// 		var data_arr = new Float32Array( dt_size * dt_size * 3 );
// 		var length = dt_size * dt_size;

// 		for ( var i = 0; i < length; i ++ ) {

// 			var val = MathUtils.randFloat( 0, 1 );
// 			data_arr[ i * 3 + 0 ] = val;
// 			data_arr[ i * 3 + 1 ] = val;
// 			data_arr[ i * 3 + 2 ] = val;

// 		}

// 		return new DataTexture( data_arr, dt_size, dt_size, RGBFormat, FloatType );

// 	}

// } );

// export { GlitchPass };

// Importez les modules nécessaires.
import {
	DataTexture,
	FloatType,
	MathUtils,
	RGBFormat,
	ShaderMaterial,
	UniformsUtils
  } from '../../../build/three.module.js';
  import { Pass } from '../postprocessing/Pass.js';
   import { DigitalGlitch } from '../shaders/DigitalGlitch.js';
   var glitchTimer = 0;

   var GlitchPass = function (dt_size, amount, col_s) {
	Pass.call(this);
  
	if (DigitalGlitch === undefined) console.error('THREE.GlitchPass relies on DigitalGlitch');
  
	var shader = DigitalGlitch;
	this.uniforms = UniformsUtils.clone(shader.uniforms);
  
	if (dt_size == undefined) dt_size = 64;
  
	this.uniforms['tDisp'].value = this.generateHeightmap(dt_size);
  
	this.material = new ShaderMaterial({
	  uniforms: this.uniforms,
	  vertexShader: shader.vertexShader,
	  fragmentShader: shader.fragmentShader,
	});
  
	this.fsQuad = new Pass.FullScreenQuad(this.material);
  
	this.goWild = false;
	this.curF = 0;
	this.generateTrigger();
  
	// Ajoutez la propriété amount avec une valeur par défaut.
	this.amount = amount !== undefined ? amount : 0.0;
	  // Ajoutez la propriété col_s avec une valeur par défaut.
	  this.col_s = col_s !== undefined ? col_s : 0.00;
  };
  
  GlitchPass.prototype = Object.assign(Object.create(Pass.prototype), {
	constructor: GlitchPass,
  	// Méthode pour définir la distortion
// Méthode pour définir la distortion
setDistortion: function (distortion) {
	this.uniforms.distortion_x.value = distortion;
	this.uniforms.distortion_y.value = distortion;
},


	render: function (renderer, writeBuffer, readBuffer) {
	  this.uniforms['tDiffuse'].value = readBuffer.texture;
	  this.uniforms['seed'].value = Math.random(); // Default seeding
	  this.uniforms['byp'].value = 0;
  

	  if (this.col_s > 0) {
		
    // Augmentez le compteur de la minuterie à chaque trame (par exemple, 1/60 seconde).
    glitchTimer += 60 / 60; // 1/60 seconde est une estimation, ajustez selon votre besoin.

    // Si la minuterie atteint 1 seconde, activez le glitch.
    if (glitchTimer >= 1) {
        this.uniforms['byp'].value = 0; // Activez le glitch.
        glitchTimer = 0; // Réinitialisez la minuterie.
    }
 else {
    this.uniforms['byp'].value = 1; // Désactivez le glitch.
}

        if (this.curF % this.randX == 0 || this.goWild == true) {
            this.uniforms['amount'].value = this.amount;
            this.uniforms['col_s'].value = this.col_s;
            this.uniforms['angle'].value = MathUtils.randFloat(-Math.PI, Math.PI);
            this.uniforms['seed_x'].value = MathUtils.randFloat(-1, 1);
            this.uniforms['seed_y'].value = MathUtils.randFloat(-1, 1);
            this.uniforms['distortion_x'].value = MathUtils.randFloat(0, 1);
            this.uniforms['distortion_y'].value = MathUtils.randFloat(0, 1);
            this.curF = 0;
            this.generateTrigger();
        } else if (this.curF % this.randX < this.randX / 5) {
            this.uniforms['amount'].value = this.amount;
            this.uniforms['col_s'].value = this.col_s;
            this.uniforms['angle'].value = MathUtils.randFloat(-Math.PI, Math.PI);
            this.uniforms['distortion_x'].value = MathUtils.randFloat(0, 1);
            this.uniforms['distortion_y'].value = MathUtils.randFloat(0, 1);
            this.uniforms['seed_x'].value = MathUtils.randFloat(-0.1, 0.1);
            this.uniforms['seed_y'].value = MathUtils.randFloat(-0.1, 0.1);
        }
    } else {
        // Lorsque col_s est inférieur ou égal à 0, désactivez le glitch.
        this.uniforms['byp'].value = 1;
    }
	  this.curF += 2;
  
	  if (this.renderToScreen) {
		renderer.setRenderTarget(null);
		this.fsQuad.render(renderer);
	  } else {
		renderer.setRenderTarget(writeBuffer);
		if (this.clear) renderer.clear();
		this.fsQuad.render(renderer);
	  }
	
	},

	generateTrigger: function () {
		this.randX = MathUtils.randInt(120, 1040);
	  },
  
	generateHeightmap: function (dt_size) {
	  var data_arr = new Float32Array(dt_size * dt_size * 3);
	  var length = dt_size * dt_size;
	  for (var i = 0; i < length; i++) {
		var val = MathUtils.randFloat(0, 1);
		data_arr[i * 3 + 0] = val;
		data_arr[i * 3 + 1] = val;
		data_arr[i * 3 + 2] = val;
	  }
	  return new DataTexture(data_arr, dt_size, dt_size, RGBFormat, FloatType);
	},
  });
  
  export { GlitchPass };
  
