/**
 * Afterimage shader
 * I created this effect inspired by a demo on codepen:
 * https://codepen.io/brunoimbrizi/pen/MoRJaN?page=1&
 */

// var AfterimageShader = {

// 	uniforms: {

// 		'damp': { value: 0.96 },
// 		'tOld': { value: null },
// 		'tNew': { value: null }

// 	},

// 	vertexShader: [

// 		'varying vec2 vUv;',

// 		'void main() {',

// 		'	vUv = uv;',
// 		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

// 		'}'

// 	].join( '\n' ),

// 	fragmentShader: [

// 		'uniform float damp;',

// 		'uniform sampler2D tOld;',
// 		'uniform sampler2D tNew;',

// 		'varying vec2 vUv;',

// 		'vec4 when_gt( vec4 x, float y ) {',

// 		'	return max( sign( x - y ), 0.0 );',

// 		'}',

// 		'void main() {',

// 		'	vec4 texelOld = texture2D( tOld, vUv );',
// 		'	vec4 texelNew = texture2D( tNew, vUv );',

// 		'	texelOld *= damp * when_gt( texelOld, 0.1 );',

// 		'	gl_FragColor = max(texelNew, texelOld);',

// 		'}'

// 	].join( '\n' )

// };





















// var AfterimageShader = {

//     uniforms: {
//         'damp': { value: 0.99 },
//         'tOld': { value:0.99 },
//         'tNew': { value: 0.99 },
//         'mouse': { value: new THREE.Vector2(0.5, 0.5) },
//         'radius': { value: 0.1 }
//     },

//     vertexShader: [

//         'varying vec2 vUv;',

//         'void main() {',

//         '	vUv = uv;',
//         '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

//         '}'

//     ].join('\n'),

//     fragmentShader: [

//         'uniform float damp;',
//         'uniform sampler2D tOld;',
//         'uniform sampler2D tNew;',
//         'uniform vec2 mouse;',
//         'uniform float radius;',

//         'varying vec2 vUv;',

//         'vec4 when_lt( vec4 x, float y ) {',
//         '	return max( sign( y - x ), 0.0 );',
//         '}',

//         'void main() {',
//         '	vec4 texelOld = texture2D( tOld, vUv );',
//         '	vec4 texelNew = texture2D( tNew, vUv );',
 
//         '	// Calculez la distance entre la position de ce pixel et la position de la souris',
//         '	float distance = distance(vUv, mouse);',

//         '	// Ajustez la valeur de damp en fonction de la distance par rapport au rayon',
//         '	if (distance < radius) {',
//         '		texelOld *= damp* 1.9* when_lt( texelOld, 0.35 );',
//         '          texelNew*= damp* 1.1* when_lt( texelOld, 0.75 ); ',

// 		'    } else {',
        
//         '        texelOld *= damp * 0.1 * when_lt( texelOld, 0.9 );',
//         '    }',
//         '	gl_FragColor = max(texelNew, texelOld);',

//         '}'

//     ].join('\n')

// };

// export { AfterimageShader };




















var AfterimageShader = {

    uniforms: {
        'damp': { value: 0.99 },
        'tOld': { value:0.99 },
        'tNew': { value: 0.99 },
        'mouse': { value: new THREE.Vector2(0.5, 0.5) },
        'radius': { value: 0.1 },
        'myCustomUniform': { value: 0.0 },
    },

    vertexShader: [

        'varying vec2 vUv;',

        'void main() {',

        '	vUv = uv;',
        '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

        '}'

    ].join('\n'),

    fragmentShader: [
        'uniform float myCustomUniform;',
        'uniform float damp;',
        'uniform sampler2D tOld;',
        'uniform sampler2D tNew;',
        'uniform vec2 mouse;',
        'uniform float radius;',
        'uniform vec2 u_resolution;', 
        'varying vec2 vUv;',

        'vec4 when_lt( vec4 x, float y ) {',
        '	return max( sign( y - x ), 0.0 );',
        '}',

        'void main() {',
        '	vec4 texelOld = texture2D( tOld, vUv );',
        '	vec4 texelNew = texture2D( tNew, vUv );',
        ' vec2 st = gl_FragCoord.xy/u_resolution;',
      '  // Calculate the distance between the current fragments position and the center of the screen',

        'float distanceToCenter = distance(st, vec2(0.5));',

        '	// Calculez la distance entre la position de ce pixel et la position de la souris',
        '	float distance = distance(vUv, mouse);',

       ' float effectFactor = clamp(0.1, 0.5,0.9);',

        '	// Ajustez la valeur de damp en fonction de la distance par rapport au rayon',
        '	if (distance < radius) {',
        '		texelOld *= damp* 2.7* when_lt( texelOld, 0.35 )*effectFactor; ;',
        '        // texelNew*= damp* 1.5* when_lt( texelOld, 0.75 )*effectFactor; ',

		'    } else {',
        '   if (myCustomUniform > 0.0)  {	' ,
        '  	texelOld *= damp* 0.1* when_lt( texelOld, 0.1 );',
        '    //texelNew*= damp* 1.1* when_lt( texelOld, 0.75 );',
        '    }',
  
 
        '    }',
        'texelOld.a *= mix(1.0, 0.0, effectFactor);',
        ' texelNew.a *= mix(0.2, 1.0, effectFactor);',
     
        '// Use the distance to the center in some way, e.g., combine it with the other distance',
     
        '	gl_FragColor = max(texelNew, texelOld);',

        '}'

    ].join('\n')

};

export { AfterimageShader };
